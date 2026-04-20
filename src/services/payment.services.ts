"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IMovieAccess {
	hasAccess: boolean;
	accessType?: "FREE" | "SUBSCRIPTION" | "BOUGHT" | "RENTED";
	expiresAt?: string;
}

export const checkMovieAccess = async (movieId: string): Promise<IMovieAccess | null> => {
	try {
		const result = await httpClient.get<IMovieAccess>(`/payments/access/${movieId}`);
		return result.data ?? null;
	} catch {
		return null;
	}
};
