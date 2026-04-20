"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getMyProfile = async () => {
	try {
		const result = await httpClient.get<any>("/auth/me");
		return result;
	} catch (error) {
		console.error("Error fetching my profile:", error);
		return null;
	}
};


export const updateMyProfile = async (formData: FormData): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/update-profile", formData, { isFormData: true });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		const msg = e?.response?.data?.message ?? e?.message ?? "Error updating profile";
		throw new Error(msg);
	}
};

export const changeEmail = async (payload: { newEmail: string }): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-email", payload);
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		console.error("Error changing email:", e?.response?.data ?? e);
		const msg = e?.response?.data?.message ?? e?.message ?? "Error changing email";
		throw new Error(msg);
	}
};

export const changeEmailAndLogout = async (newEmail: string): Promise<void> => {
	try {
		await httpClient.patch<any>("/users/change-email", { newEmail });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		const msg = e?.response?.data?.message ?? e?.message ?? "Error changing email";
		throw new Error(msg);
	}

	// Clear auth cookies so old JWT is gone before verify-email
	const cookieStore = await cookies();
	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");
	cookieStore.delete("better-auth.session_token");
	cookieStore.delete("better-auth.session_data");

	redirect(`/verify-email?email=${encodeURIComponent(newEmail)}`);
};
