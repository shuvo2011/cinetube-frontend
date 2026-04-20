"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICastMember } from "@/types/castMember.types";

const getErrorMessage = (error: unknown): string => {
	if (
		error &&
		typeof error === "object" &&
		"response" in error &&
		error.response &&
		typeof error.response === "object" &&
		"data" in error.response &&
		error.response.data &&
		typeof error.response.data === "object" &&
		"message" in error.response.data
	) {
		return String(error.response.data.message);
	}
	if (error instanceof Error) return error.message;
	return "Something went wrong.";
};

export async function createCastMemberAction(name: string): Promise<ApiResponse<ICastMember>> {
	try {
		return await httpClient.post<ICastMember>("/cast-members", { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ICastMember };
	}
}

export async function updateCastMemberAction(id: string, name: string): Promise<ApiResponse<ICastMember>> {
	try {
		return await httpClient.patch<ICastMember>(`/cast-members/${id}`, { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ICastMember };
	}
}

export async function deleteCastMemberAction(id: string): Promise<ApiResponse<ICastMember>> {
	try {
		return await httpClient.delete<ICastMember>(`/cast-members/${id}`);
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ICastMember };
	}
}
