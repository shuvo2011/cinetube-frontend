import { z } from "zod";

export const loginZodSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export const registerZodSchema = z.object({
	name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
