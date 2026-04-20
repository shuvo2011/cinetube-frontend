"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IGenre } from "@/types/genre.types";

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

export async function createGenreAction(name: string): Promise<ApiResponse<IGenre>> {
	try {
		return await httpClient.post<IGenre>("/genres", { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IGenre };
	}
}

export async function updateGenreAction(id: string, name: string): Promise<ApiResponse<IGenre>> {
	try {
		return await httpClient.patch<IGenre>(`/genres/${id}`, { name });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IGenre };
	}
}

export async function deleteGenreAction(id: string): Promise<ApiResponse<IGenre>> {
	try {
		return await httpClient.delete<IGenre>(`/genres/${id}`);
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IGenre };
	}
}
