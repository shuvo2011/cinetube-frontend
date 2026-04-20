export interface ICommentUser {
	id: string;
	name: string;
	image: string | null;
}

export interface ICommentReply {
	id: string;
	reviewId: string;
	userId: string;
	content: string;
	parentId: string;
	createdAt: string;
	updatedAt: string;
	user: ICommentUser;
}

export interface IComment {
	id: string;
	reviewId: string;
	userId: string;
	content: string;
	parentId: string | null;
	createdAt: string;
	updatedAt: string;
	user: ICommentUser;
	replies: ICommentReply[];
}
