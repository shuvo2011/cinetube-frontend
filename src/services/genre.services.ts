"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IGenre } from "@/types/genre.types";

export const getGenres = async () => {
	try {
		const result = await httpClient.get<IGenre[]>("/genres?limit=100");
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching genres:", error);
		return [];
	}
};

export const getGenresForAdmin = async (queryString: string) => {
	try {
		return await httpClient.get<IGenre[]>(queryString ? `/genres?${queryString}` : "/genres");
	} catch (error) {
		console.log("Error fetching genres:", error);
		throw error;
	}
};
