"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

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

export interface IAdminReview {
	id: string;
	content: string;
	rating: number;
	status: "PENDING" | "PUBLISHED" | "UNPUBLISHED" | "DRAFT";
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	movie: {
		id: string;
		title: string;
	};
	tags?: {
		id: string;
		name: string;
	}[];
	_count: { likes: number; comments: number };
}

export const getReviewsForAdmin = async (queryString?: string) => {
	return await httpClient.get<IAdminReview[]>(queryString ? `/reviews/?${queryString}` : "/reviews");
};

export const updateReviewStatusAction = async (id: string, status: string): Promise<ApiResponse<null>> => {
	return await httpClient.patch(`/reviews/${id}/status`, { status });
};

export const getReviewsByMovie = async (movieId: string, page = 1) => {
	try {
		const result = await httpClient.get<any>(`/reviews/movie/${movieId}?limit=10&page=${page}`);
		return {
			data: result.data?.data ?? [],
			meta: result.data?.meta ?? {},
		};
	} catch (error) {
		console.log("Error fetching reviews:", error);
		return { data: [], meta: {} };
	}
};

export const getMyReviewForMovie = async (movieId: string) => {
	try {
		const result = await httpClient.get<any>(`/reviews/my/reviews?movieId=${movieId}&limit=1`);
		const list = Array.isArray(result.data) ? result.data : (result.data?.data ?? []);
		return list[0] ?? null;
	} catch {
		return null;
	}
};

export const getPendingReviewsForMovie = async (movieId: string) => {
	try {
		const result = await httpClient.get<any>(`/reviews?movieId=${movieId}&status=PENDING&limit=100`);
		return Array.isArray(result.data) ? result.data : (result.data?.data ?? []);
	} catch {
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
		return await httpClient.delete(`/reviews/${id}`);
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

export const updateReviewAction = async (
	reviewId: string,
	payload: {
		rating: number;
		content: string;
		hasSpoiler: boolean;
		tagIds: string[];
	},
) => {
	return await httpClient.patch(`/reviews/${reviewId}`, payload);
};

export const createReviewAction = async (payload: {
	movieId: string;
	rating: number;
	content: string;
	hasSpoiler: boolean;
	tagIds: string[];
}) => {
	return await httpClient.post("/reviews", payload);
};

export const toggleReviewLikeAction = async (reviewId: string) => {
	return await httpClient.post<{ liked: boolean }>(`/review-likes/${reviewId}`, {});
};
