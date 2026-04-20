import { z } from "zod";

export const updateProfileZodSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(50, "Name must be at most 50 characters")
		.optional(),
	email: z.string().email("Invalid email address").optional(),
});

export type IUpdateProfilePayload = z.infer<typeof updateProfileZodSchema>;
