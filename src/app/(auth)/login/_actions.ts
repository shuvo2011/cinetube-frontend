/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { COOKIE_NAMES } from "@/utils/cookie.constants";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
	payload: ILoginPayload,
	redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
	const parsedPayload = loginZodSchema.safeParse(payload);

	if (!parsedPayload.success) {
		return {
			success: false,
			message: parsedPayload.error.issues[0]?.message || "Invalid input",
		};
	}

	try {
		const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

		const { accessToken, refreshToken, token, user } = response.data;
		const { role, emailVerified, email, status } = user;

		if (status === "BLOCKED") {
			return {
				success: false,
				message: "Your account has been blocked. Please contact support for assistance.",
			};
		}

		// ✅ cookie set using constants
		await setTokenInCookies(COOKIE_NAMES.ACCESS_TOKEN, accessToken);
		await setTokenInCookies(COOKIE_NAMES.REFRESH_TOKEN, refreshToken);
		await setTokenInCookies(COOKIE_NAMES.SESSION_TOKEN, token, 24 * 60 * 60);

		// ✅ verify email check
		if (!emailVerified) {
			redirect(`/verify-email?email=${email}`);
		}

		// ✅ safe redirect
		const targetPath =
			redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
				? redirectPath
				: getDefaultDashboardRoute(role as UserRole);

		redirect(targetPath);
	} catch (error: any) {
		// ✅ Next redirect pass-through
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			typeof error.digest === "string" &&
			error.digest.startsWith("NEXT_REDIRECT")
		) {
			throw error;
		}

		const errMsg: string = error?.response?.data?.message || error?.message || "Login failed";

		if (/blocked/i.test(errMsg)) {
			return {
				success: false,
				message: "Your account has been blocked. Please contact support for assistance.",
			};
		}

		if (errMsg === "Email not verified") {
			redirect(`/verify-email?email=${payload.email}`);
		}

		return { success: false, message: errMsg };
	}
};
