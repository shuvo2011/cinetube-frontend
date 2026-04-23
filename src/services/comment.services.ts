"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IComment } from "@/types/comment.types";
export interface IAdminComment {
	id: string;
	content: string;
	status: string;
	parentId: string | null;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	review?: {
		id: string;
		movie: { id: string; title: string };
	};
}

// ✅ admin comments (only once)
export const getCommentsForAdmin = async (queryString?: string) => {
	return await httpClient.get<IAdminComment[]>(queryString ? `/comments/?${queryString}` : "/comments");
};

// ✅ delete comment (only once)
export const deleteCommentAction = async (id: string): Promise<ApiResponse<null>> => {
	return await httpClient.delete<null>(`/comments/${id}`);
};

// ✅ user side (review comments)
export const getCommentsAction = async (reviewId: string) => {
	return await httpClient.get<IComment[]>(`/comments/review/${reviewId}?limit=100`);
};

export const createCommentAction = async (payload: { reviewId: string; content: string; parentId?: string }) => {
	return await httpClient.post<IComment>("/comments", payload);
};
