"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface IWatchlistItem {
	id: string;
	userId: string;
	movieId: string;
	createdAt: string;
	movie: {
		id: string;
		title: string;
		posterImage: string | null;
		pricingType: "FREE" | "PREMIUM";
		rentPrice: number;
		buyPrice: number;
		releaseYear: number;
		director: string;
		genres: { genre: { id: string; name: string } }[];
	};
}

export const getMyWatchlistItems = async (queryString?: string) => {
	try {
		return await httpClient.get<IWatchlistItem[]>(queryString ? `/watchlist?${queryString}` : "/watchlist");
	} catch (error) {
		console.log("Error fetching watchlist:", error);
		throw error;
	}
};

export const isMovieInWatchlist = async (movieId: string): Promise<boolean> => {
	try {
		const result = await httpClient.get<IWatchlistItem[]>("/watchlist?limit=1000");
		const items = result.data ?? [];
		return items.some((item) => item.movieId === movieId);
	} catch {
		return false;
	}
};

export const toggleWatchlistAction = async (movieId: string, inWatchlist: boolean) => {
	if (inWatchlist) {
		return await httpClient.delete<null>(`/watchlist/${movieId}`);
	}

	return await httpClient.post<null>(`/watchlist/${movieId}`, {});
};

export const removeFromWatchlistAction = async (movieId: string): Promise<ApiResponse<null>> => {
	return await httpClient.delete<null>(`/watchlist/${movieId}`);
};
