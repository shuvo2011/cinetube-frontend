/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (
	email: string,
	otp: string,
): Promise<{ success: boolean; message?: string } | ApiErrorResponse> => {
	try {
		await httpClient.post("/auth/verify-email", { email, otp });
		redirect("/login");
	} catch (error: any) {
		if (error?.digest?.startsWith("NEXT_REDIRECT")) {
			throw error;
		}
		return {
			success: false,
			message: error?.response?.data?.message || error.message || "Verification failed",
		};
	}
};

export const resendOtpAction = async (email: string): Promise<{ success: boolean; message?: string }> => {
	try {
		await httpClient.post("/auth/resend-otp", { email });
		return { success: true, message: "OTP sent successfully" };
	} catch (error: any) {
		return {
			success: false,
			message: error?.response?.data?.message || "Failed to resend OTP",
		};
	}
};
