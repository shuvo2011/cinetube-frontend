"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IReview {
	id: string;
	movieId: string;
	userId: string;
	rating: number;
	reviewText: string;
	status: "PENDING" | "PUBLISHED" | "UNPUBLISHED";
	containsSpoiler: boolean;
	tags: string[];
	totalLikes: number;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	comments: {
		id: string;
		content: string;
		user: {
			id: string;
			name: string;
		};
	}[];
}

export const getReviewsByMovie = async (movieId: string) => {
	try {
		const result = await httpClient.get<any>(`/reviews/movie/${movieId}?limit=20`);
		return result.data?.data ?? [];
	} catch (error) {
		console.log("Error fetching reviews:", error);
		return [];
	}
};
