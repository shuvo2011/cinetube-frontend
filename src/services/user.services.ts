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

// ── Admin user management ──────────────────────────────────────────────────

export interface IAdminUser {
	id: string;
	name: string;
	email: string;
	image: string | null;
	role: "USER" | "ADMIN" | "SUPER_ADMIN";
	status: "ACTIVE" | "BLOCKED" | "DELETED";
	emailVerified: boolean;
	subscriptionStatus: string;
	createdAt: string;
	isDeleted: boolean;
}

export const getAllUsers = async (queryString?: string): Promise<ApiResponse<IAdminUser[]>> => {
	try {
		return await httpClient.get<IAdminUser[]>(queryString ? `/users?${queryString}` : "/users");
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error fetching users");
	}
};

export const changeUserStatus = async (userId: string, status: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-user-status", { userId, status });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error changing status");
	}
};

export const changeUserRole = async (userId: string, role: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-user-role", { userId, role });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const e: any = error;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error changing role");
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
