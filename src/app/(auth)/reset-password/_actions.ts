"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (
	email: string,
	otp: string,
	newPassword: string,
): Promise<{ success: boolean; message?: string } | ApiErrorResponse> => {
	try {
		await httpClient.post("/auth/reset-password", { email, otp, newPassword });
		redirect("/login");
	} catch (error: any) {
		if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
		return {
			success: false,
			message: error?.response?.data?.message || error.message || "Failed to reset password",
		};
	}
};
