"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IComment } from "@/types/comment.types";

export const getCommentsByReview = async (reviewId: string) => {
	try {
		const result = await httpClient.get<IComment[]>(`/comments/review/${reviewId}?limit=100`);
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching comments:", error);
		return [];
	}
};
