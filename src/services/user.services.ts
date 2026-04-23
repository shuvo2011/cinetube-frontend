"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { COOKIE_NAMES } from "@/utils/cookie.constants";
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

export const updateMyProfile = async (payload: {
	name?: string;
	image?: string;
	imagePublicId?: string;
}): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/update-profile", payload);
	} catch (error) {
		const e = error as any;
		const msg = e?.response?.data?.message ?? e?.message ?? "Error updating profile";
		throw new Error(msg);
	}
};

export const changeEmail = async (payload: { newEmail: string }): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-email", payload);
	} catch (error) {
		const e = error as any;
		console.error("Error changing email:", e?.response?.data ?? e);
		const msg = e?.response?.data?.message ?? e?.message ?? "Error changing email";
		throw new Error(msg);
	}
};

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
		const e = error as any;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error fetching users");
	}
};

export const changeUserStatus = async (userId: string, status: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-user-status", { userId, status });
	} catch (error) {
		const e = error as any;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error changing status");
	}
};

export const changeUserRole = async (userId: string, role: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.patch<any>("/users/change-user-role", { userId, role });
	} catch (error) {
		const e = error as any;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Error changing role");
	}
};

export const changeEmailAndLogout = async (newEmail: string): Promise<void> => {
	try {
		await httpClient.patch<any>("/users/change-email", { newEmail });
	} catch (error) {
		const e = error as any;
		const msg = e?.response?.data?.message ?? e?.message ?? "Error changing email";
		throw new Error(msg);
	}

	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
	cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
	cookieStore.delete(COOKIE_NAMES.SESSION_TOKEN);
	cookieStore.delete(COOKIE_NAMES.SESSION_DATA);

	redirect(`/verify-email?email=${encodeURIComponent(newEmail)}`);
};

export const softDeleteUser = async (userId: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.delete<any>(`/users/${userId}`);
	} catch (error) {
		const e = error as any;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Failed to delete user");
	}
};

export const hardDeleteUser = async (userId: string): Promise<ApiResponse<any>> => {
	try {
		return await httpClient.delete<any>(`/users/hard/${userId}`);
	} catch (error) {
		const e = error as any;
		throw new Error(e?.response?.data?.message ?? e?.message ?? "Failed to hard delete user");
	}
};
