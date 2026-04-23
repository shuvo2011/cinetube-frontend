import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokens, getUserInfo } from "./services/auth.services";
import { COOKIE_NAMES } from "./utils/cookie.constants";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
	try {
		const refresh = await getNewTokens(refreshToken);
		return !!refresh;
	} catch (error) {
		console.error("Error refreshing token in middleware:", error);
		return false;
	}
}

export async function proxy(request: NextRequest) {
	try {
		const { pathname } = request.nextUrl;

		// ✅ use constants
		const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
		const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

		// ✅ avoid double verify
		const verified = accessToken ? jwtUtils.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string) : null;

		const isValidAccessToken = verified?.success;
		const decodedAccessToken = verified?.data;

		let userRole: UserRole | null = decodedAccessToken?.role ?? null;

		const routerOwner = getRouteOwner(pathname);
		const isAuth = isAuthRoute(pathname);

		// normalize role
		if (userRole === "SUPER_ADMIN") userRole = "ADMIN";

		// 🔥 refresh token
		if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken!))) {
			const requestHeaders = new Headers(request.headers);

			try {
				const refreshed = await refreshTokenMiddleware(refreshToken);
				if (refreshed) {
					requestHeaders.set("x-token-refreshed", "1");
				}
			} catch (error) {
				console.error("Error refreshing token:", error);
			}

			return NextResponse.next({ request: { headers: requestHeaders } });
		}

		// Rule-1
		if (isAuth && isValidAccessToken) {
			return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
		}

		// Rule-2
		if (pathname === "/reset-password") {
			const email = request.nextUrl.searchParams.get("email");
			if (email) return NextResponse.next();

			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Rule-3
		if (routerOwner === null) {
			return NextResponse.next();
		}

		// Rule-4
		if (!accessToken || !isValidAccessToken) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Rule-5
		if (accessToken) {
			const userInfo = await getUserInfo();

			if (userInfo) {
				if (userInfo.status === "BLOCKED" || userInfo.isDeleted || userInfo.status === "DELETED") {
					const loginUrl = new URL("/login", request.url);
					const response = NextResponse.redirect(loginUrl);

					// ✅ use constants
					response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
					response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
					response.cookies.delete(COOKIE_NAMES.SESSION_TOKEN);
					response.cookies.delete(COOKIE_NAMES.SESSION_DATA);

					return response;
				}

				if (!userInfo.emailVerified) {
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

		// Rule-6
		if (routerOwner === "COMMON") {
			return NextResponse.next();
		}

		// Rule-7
		if ((routerOwner === "ADMIN" || routerOwner === "USER") && routerOwner !== userRole) {
			return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
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
