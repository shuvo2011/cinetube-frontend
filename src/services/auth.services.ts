"use server";

import axios from "axios";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { COOKIE_NAMES } from "@/utils/cookie.constants";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
	throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokens(refreshToken: string): Promise<boolean> {
	try {
		const res = await axios.post(
			`${BASE_API_URL}/auth/refresh-token`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Cookie: `${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`,
				},
			},
		);

		const { data } = res.data;
		const { accessToken, refreshToken: newRefreshToken, token } = data;

		if (accessToken) {
			await setTokenInCookies(COOKIE_NAMES.ACCESS_TOKEN, accessToken);
		}

		if (newRefreshToken) {
			await setTokenInCookies(COOKIE_NAMES.REFRESH_TOKEN, newRefreshToken);
		}

		if (token) {
			await setTokenInCookies(COOKIE_NAMES.SESSION_TOKEN, token, 24 * 60 * 60);
		}

		return true;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return false;
	}
}

export async function getUserInfo() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
		const sessionToken = cookieStore.get(COOKIE_NAMES.SESSION_TOKEN)?.value;

		if (!accessToken) {
			return null;
		}

		const cookieParts = [`${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`];
		if (sessionToken) {
			cookieParts.push(`${COOKIE_NAMES.SESSION_TOKEN}=${sessionToken}`);
		}

		const res = await axios.get(`${BASE_API_URL}/auth/me`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieParts.join("; "),
			},
		});

		return res.data.data;
	} catch (error: any) {
		console.error("Error fetching user info:", error?.response?.data ?? error?.message ?? error);
		return null;
	}
}

export async function logout() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
		const sessionToken = cookieStore.get(COOKIE_NAMES.SESSION_TOKEN)?.value;

		const cookieParts: string[] = [];

		if (accessToken) {
			cookieParts.push(`${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`);
		}

		if (sessionToken) {
			cookieParts.push(`${COOKIE_NAMES.SESSION_TOKEN}=${sessionToken}`);
		}

		await axios.post(
			`${BASE_API_URL}/auth/logout`,
			{},
			{
				headers: {
					...(cookieParts.length > 0 ? { Cookie: cookieParts.join("; ") } : {}),
				},
			},
		);
	} catch (error: any) {
		console.error("Logout error:", error?.response?.data ?? error?.message ?? error);
	} finally {
		const cookieStore = await cookies();
		cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
		cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
		cookieStore.delete(COOKIE_NAMES.SESSION_TOKEN);
		cookieStore.delete(COOKIE_NAMES.SESSION_DATA);
	}
}
