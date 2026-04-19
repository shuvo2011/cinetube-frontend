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

export const approveReview = async (id: string, status: string) => {
	try {
		const result = await httpClient.patch(`/reviews/${id}/status`, { status });
		return result.data;
	} catch (error) {
		console.log("Error updating review status:", error);
		return null;
	}
};

export const deleteReview = async (id: string) => {
	try {
		const result = await httpClient.delete(`/reviews/${id}`);
		return result.data;
	} catch (error) {
		console.log("Error deleting review:", error);
		return null;
	}
};

export const updateReviewStatus = async (id: string, status: string) => {
	try {
		const result = await httpClient.patch(`/reviews/${id}/status`, { status });
		return result.data;
	} catch (error) {
		console.log("Error updating review status:", error);
		return null;
	}
};
