"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IMovie } from "@/types/movie.types";

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

export async function createMovieAction(formData: FormData): Promise<ApiResponse<IMovie>> {
	try {
		return await httpClient.post<IMovie>("/movies", formData, { isFormData: true });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IMovie };
	}
}

export async function updateMovieAction(id: string, formData: FormData): Promise<ApiResponse<IMovie>> {
	try {
		return await httpClient.patch<IMovie>(`/movies/${id}`, formData, { isFormData: true });
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IMovie };
	}
}

export async function deleteMovieAction(id: string): Promise<ApiResponse<IMovie>> {
	try {
		return await httpClient.delete<IMovie>(`/movies/${id}`);
	} catch (error) {
		return { success: false, message: getErrorMessage(error), data: null as unknown as IMovie };
	}
}
