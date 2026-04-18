"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (
	email: string,
): Promise<{ success: boolean; message?: string } | ApiErrorResponse> => {
	try {
		await httpClient.post("/auth/forget-password", { email });
		redirect(`/reset-password?email=${email}`);
	} catch (error: any) {
		if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
		return {
			success: false,
			message: error?.response?.data?.message || error.message || "Failed to send OTP",
		};
	}
};
