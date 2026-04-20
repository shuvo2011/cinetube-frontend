"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IGenre } from "@/types/genre.types";
import { IMovie } from "@/types/movie.types";
import { IPlatform } from "@/types/platform.types";

export const getMovies = async (queryString?: string) => {
	try {
		const result = await httpClient.get<IMovie[]>(queryString ? `/movies?${queryString}` : "/movies");
		return result;
	} catch (error) {
		console.log("Error fetching movies:", error);
		return null;
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
export const getTopRatedMovies = async (limit = 5): Promise<IMovie[]> => {
	try {
		const result = await httpClient.get<IMovie[]>(`/movies/top-rated?limit=${limit}`);
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching top rated movies:", error);
		return [];
	}
};
export const getMovieFilters = async () => {
	try {
		const result = await httpClient.get<{
			genres: IGenre[];
			platforms: IPlatform[];
			availableYears: number[];
		}>("/movies/filters");
		return result.data ?? { genres: [], platforms: [], availableYears: [] };
	} catch (error) {
		console.log("Error fetching movie filters:", error);
		return { genres: [], platforms: [], availableYears: [] };
	}
};

export const getMoviesForAdmin = async (queryString: string) => {
	try {
		return await httpClient.get<IMovie[]>(queryString ? `/movies?${queryString}` : "/movies");
	} catch (error) {
		console.log("Error fetching movies:", error);
		throw error;
	}
};
