export interface IMyReview {
	id: string;
	userId: string;
	movieId: string;
	rating: number;
	content: string;
	hasSpoiler: boolean;
	status: "DRAFT" | "PENDING" | "PUBLISHED" | "UNPUBLISHED";
	unpublishReason: string | null;
	isDeleted: boolean;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
	movie: {
		id: string;
		title: string;
		posterImage: string | null;
		releaseYear: number;
	};
	tags: {
		reviewId: string;
		tagId: string;
		tag: {
			id: string;
			name: string;
		};
	}[];
	_count: {
		likes: number;
		comments: number;
	};
	likes: {
		userId: string;
		reviewId: string;
		createdAt: string;
	}[];
}
