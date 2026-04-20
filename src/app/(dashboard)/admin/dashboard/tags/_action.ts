"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ITag } from "@/types/tag.types";

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

export async function createTagAction(name: string): Promise<ApiResponse<ITag>> {
	try {
		return await httpClient.post<ITag>("/tags", { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ITag };
	}
}

export async function updateTagAction(id: string, name: string): Promise<ApiResponse<ITag>> {
	try {
		return await httpClient.patch<ITag>(`/tags/${id}`, { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ITag };
	}
}

export async function deleteTagAction(id: string): Promise<ApiResponse<ITag>> {
	try {
		return await httpClient.delete<ITag>(`/tags/${id}`);
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as ITag };
	}
}
