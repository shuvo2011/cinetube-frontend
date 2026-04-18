/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forgotPasswordAction } from "@/app/(auth)/forgot-password/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ForgotPasswordForm = () => {
	const [serverError, setServerError] = useState<string | null>(null);

	const { mutateAsync, isPending } = useMutation({
		mutationFn: (email: string) => forgotPasswordAction(email),
	});

	const form = useForm({
		defaultValues: { email: "" },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const result = (await mutateAsync(value.email)) as any;
				if (result && !result.success) {
					setServerError(result.message || "Failed to send OTP");
				}
			} catch (error: any) {
				setServerError(error.message || "Failed to send OTP");
			}
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-sm bg-card border border-border rounded-2xl p-10">
				<div className="text-center mb-6">
					<div className="text-xl font-medium tracking-wide mb-5">
						<span className="text-foreground">Cine</span>
						<span className="text-destructive">Tube</span>
					</div>

					<div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
						<KeyRound className="size-6 text-destructive" />
					</div>

					<h3 className="text-lg font-semibold text-foreground mb-1">Forgot password?</h3>
					<p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset code.</p>
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
					<form.Field name="email" validators={{ onChange: forgotPasswordZodSchema.shape.email }}>
						{(field) => <AppField field={field} label="Email" type="email" placeholder="Enter your email" />}
					</form.Field>

					{serverError && (
						<Alert variant="destructive">
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}

					<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
						{([canSubmit, isSubmitting]) => (
							<AppSubmitButton
								isPending={isSubmitting || isPending}
								pendingLabel="Sending OTP..."
								disabled={!canSubmit}
							>
								Send Reset Code
							</AppSubmitButton>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-6 text-center">
					<Link
						href="/login"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="size-3.5" />
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordForm;
