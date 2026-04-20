import z from "zod";

export const createCommentZodSchema = z.object({
	reviewId: z.string().min(1, "Review ID is required"),
	content: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(500, "Comment must be at most 500 characters"),
	parentId: z.string().optional(),
});

export const updateCommentZodSchema = z.object({
	content: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(500, "Comment must be at most 500 characters"),
});
