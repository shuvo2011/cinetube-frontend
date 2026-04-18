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

export const forgotPasswordZodSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordZodSchema = z
	.object({
		otp: z.string().length(6, "OTP must be exactly 6 characters"),
		newPassword: z.string().min(6, "Password must be at least 6 characters").max(32),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
