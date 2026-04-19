"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IGenre {
	id: string;
	name: string;
}

export const getGenres = async () => {
	try {
		const result = await httpClient.get<IGenre[]>("/genres?limit=100");
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching genres:", error);
		return [];
	}
};
