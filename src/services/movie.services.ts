"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IMovie } from "@/types/movie.types";

export const getMovies = async (queryString?: string) => {
	try {
		const result = await httpClient.get<IMovie[]>(queryString ? `/movies?${queryString}` : "/movies");
		return result;
	} catch (error) {
		console.log("Error fetching movies:", error);
		throw error;
	}
};

export const getMovieById = async (id: string) => {
	try {
		const result = await httpClient.get<IMovie>(`/movies/${id}`);
		return result;
	} catch (error) {
		console.log("Error fetching movie:", error);
		throw error;
	}
};
export const getTopRatedMovies = async (limit = 5) => {
	try {
		const result = await httpClient.get(`/movies/top-rated?limit=${limit}`);
		return result;
	} catch (error) {
		console.log("Error fetching top rated movies:", error);
		return null;
	}
};
