import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/utils/cookie.constants";

export async function GET(request: NextRequest) {
	const accessToken = request.nextUrl.searchParams.get("accessToken");
	const refreshToken = request.nextUrl.searchParams.get("refreshToken");
	const redirectPath = request.nextUrl.searchParams.get("redirect") || "/dashboard";

	if (!accessToken || !refreshToken) {
		return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
	}

	const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
	const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

	const response = NextResponse.redirect(new URL(finalRedirectPath, request.url));

	response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
	});

	response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
	});

	return response;
}
