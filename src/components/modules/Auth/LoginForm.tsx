/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { loginAction } from "@/app/(auth)/login/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
	redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const { mutateAsync, isPending } = useMutation({
		mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
	});

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const result = (await mutateAsync(value)) as any;
				if (!result?.success) {
					setServerError(result?.message || "Login failed");
					return;
				}
			} catch (error: any) {
				setServerError(error.message || "Login failed");
			}
		},
	});

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
			{/* Left — Branding */}
			<div className="hidden lg:flex flex-col justify-between bg-[#0f0f0f] p-12">
				<div>
					<div className="text-2xl font-medium tracking-wide mb-12">
						<span className="text-white">Cine</span>
						<span className="text-destructive">Tube</span>
					</div>

					<div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white/50 mb-6">
						<span className="w-1.5 h-1.5 rounded-full bg-destructive" />
						New releases every week
					</div>

					<h2 className="text-4xl font-semibold text-white leading-tight mb-4">
						Rate, Review &amp; <br />
						Stream your <br />
						<span className="text-destructive">Favorite Films</span>
					</h2>

					<p className="text-sm text-white/40 leading-relaxed max-w-sm">
						Discover thousands of movies and series. Read community reviews, write your own, and stream premium content
						— all in one place.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					{[
						{ value: "12K+", label: "Movies & Series" },
						{ value: "85K+", label: "Community Reviews" },
						{ value: "4.8★", label: "Average Rating" },
						{ value: "200K+", label: "Active Members" },
					].map((stat) => (
						<div key={stat.label} className="bg-white/5 rounded-xl p-4">
							<div className="text-xl font-semibold text-white mb-1">{stat.value}</div>
							<div className="text-xs text-white/40">{stat.label}</div>
						</div>
					))}
				</div>
			</div>

			{/* Right — Form */}
			<div className="flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-sm">
					{/* Mobile Logo */}
					<div className="text-2xl font-medium tracking-wide mb-8 lg:hidden text-center">
						<span className="text-foreground">Cine</span>
						<span className="text-destructive">Tube</span>
					</div>

					<div className="mb-8">
						<h3 className="text-xl font-semibold text-foreground mb-1">Welcome back</h3>
						<p className="text-sm text-muted-foreground">Please enter your credentials to log in.</p>
					</div>

					<form
						method="POST"
						noValidate
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.Field name="email" validators={{ onChange: loginZodSchema.shape.email }}>
							{(field) => <AppField field={field} label="Email" type="email" placeholder="Enter your email" />}
						</form.Field>

						<form.Field name="password" validators={{ onChange: loginZodSchema.shape.password }}>
							{(field) => (
								<AppField
									field={field}
									label="Password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									append={
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="pointer-events-auto"
											onClick={() => setShowPassword((v) => !v)}
										>
											{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
										</Button>
									}
								/>
							)}
						</form.Field>

						<div className="text-right">
							<Link href="/forgot-password" className="text-sm text-destructive hover:underline underline-offset-4">
								Forgot password?
							</Link>
						</div>

						{serverError && (
							<Alert variant="destructive">
								<AlertDescription>{serverError}</AlertDescription>
							</Alert>
						)}

						<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
							{([canSubmit, isSubmitting]) => (
								<AppSubmitButton
									isPending={isSubmitting || isPending}
									pendingLabel="Logging in..."
									disabled={!canSubmit}
								>
									Log In
								</AppSubmitButton>
							)}
						</form.Subscribe>
					</form>

					<div className="flex items-center gap-3 my-6">
						<div className="flex-1 h-px bg-border" />
						<span className="text-xs text-muted-foreground">or continue with</span>
						<div className="flex-1 h-px bg-border" />
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google`;
						}}
					>
						<svg className="size-4 mr-2" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Sign in with Google
					</Button>

					<p className="text-center text-sm text-muted-foreground mt-6">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-destructive font-medium hover:underline underline-offset-4">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
