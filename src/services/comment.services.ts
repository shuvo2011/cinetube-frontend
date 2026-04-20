"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IComment } from "@/types/comment.types";

export interface IAdminComment {
	id: string;
	content: string;
	parentId: string | null;
	createdAt: string;
	user: { id: string; name: string; email: string };
	review: {
		id: string;
		movie: { id: string; title: string };
	};
}

export const getCommentsForAdmin = async (queryString?: string) => {
	try {
		const result = await httpClient.get<IAdminComment[]>(queryString ? `/comments?${queryString}` : "/comments");
		return result;
	} catch (error) {
		console.log("Error fetching admin comments:", error);
		throw error;
	}
};

export const getCommentsByReview = async (reviewId: string) => {
	try {
		const result = await httpClient.get<IComment[]>(`/comments/review/${reviewId}?limit=100`);
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching comments:", error);
		return [];
	}
};
