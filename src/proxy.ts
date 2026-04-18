import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokens, getUserInfo } from "./services/auth.services";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
	try {
		const refresh = await getNewTokens(refreshToken);
		if (!refresh) return false;
		return true;
	} catch (error) {
		console.error("Error refreshing token in middleware:", error);
		return false;
	}
}

export async function proxy(request: NextRequest) {
	try {
		const { pathname } = request.nextUrl;
		const accessToken = request.cookies.get("accessToken")?.value;
		const refreshToken = request.cookies.get("refreshToken")?.value;

		const decodedAccessToken =
			accessToken && jwtUtils.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string).data;

		const isValidAccessToken =
			accessToken && jwtUtils.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string).success;

		let userRole: UserRole | null = null;

		if (decodedAccessToken) {
			userRole = decodedAccessToken.role as UserRole;
		}

		const routerOwner = getRouteOwner(pathname);
		const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
		userRole = unifySuperAdminAndAdminRole;
		const isAuth = isAuthRoute(pathname);

		// proactively refresh token if expiring soon
		if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken as string))) {
			const requestHeaders = new Headers(request.headers);
			const response = NextResponse.next({ request: { headers: requestHeaders } });

			try {
				const refreshed = await refreshTokenMiddleware(refreshToken);
				if (refreshed) {
					requestHeaders.set("x-token-refreshed", "1");
				}
				return NextResponse.next({
					request: { headers: requestHeaders },
					headers: response.headers,
				});
			} catch (error) {
				console.error("Error refreshing token:", error);
			}

			return response;
		}

		// Rule-1: logged in + auth route → redirect to dashboard
		if (isAuth && isValidAccessToken) {
			return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
		}

		// Rule-2: reset-password page
		if (pathname === "/reset-password") {
			const email = request.nextUrl.searchParams.get("email");
			if (email) return NextResponse.next();
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Rule-3: public route → allow
		if (routerOwner === null) {
			return NextResponse.next();
		}

		// Rule-4: not logged in + protected route → redirect to login
		if (!accessToken || !isValidAccessToken) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Rule-5: enforce email verification
		if (accessToken) {
			const userInfo = await getUserInfo();

			if (userInfo) {
				if (userInfo.emailVerified === false) {
					if (pathname !== "/verify-email") {
						const verifyEmailUrl = new URL("/verify-email", request.url);
						verifyEmailUrl.searchParams.set("email", userInfo.email);
						return NextResponse.redirect(verifyEmailUrl);
					}
					return NextResponse.next();
				}

				if (userInfo.emailVerified && pathname === "/verify-email") {
					return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
				}
			}
		}

		// Rule-6: common protected route → allow
		if (routerOwner === "COMMON") {
			return NextResponse.next();
		}

		// Rule-7: wrong role → redirect to own dashboard
		if (routerOwner === "ADMIN" || routerOwner === "USER") {
			if (routerOwner !== userRole) {
				return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
			}
		}

		return NextResponse.next();
	} catch (error) {
		console.error("Error in proxy middleware:", error);
		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)"],
};
