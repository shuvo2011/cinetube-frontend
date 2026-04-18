"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
	throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokens(refreshToken: string): Promise<boolean> {
	try {
		const res = await fetch(`${BASE_API_URL}/api/v1/auth/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: `refreshToken=${refreshToken}`,
			},
		});

		if (!res.ok) return false;

		const { data } = await res.json();
		const { accessToken, refreshToken: newRefreshToken, sessionToken } = data;

		if (accessToken) await setTokenInCookies("accessToken", accessToken);
		if (newRefreshToken) await setTokenInCookies("refreshToken", newRefreshToken);
		if (sessionToken) await setTokenInCookies("better-auth.session_token", sessionToken, 24 * 60 * 60);

		return true;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return false;
	}
}

export async function getUserInfo() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;
		const sessionToken = cookieStore.get("better-auth.session_token")?.value;

		if (!accessToken) return null;

		const res = await fetch(`${BASE_API_URL}/api/v1/auth/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
			},
		});

		if (!res.ok) return null;

		const { data } = await res.json();
		return data;
	} catch (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
}
