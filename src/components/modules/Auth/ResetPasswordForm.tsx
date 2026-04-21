/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { resetPasswordAction } from "@/app/(auth)/reset-password/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo/Logo";

const ResetPasswordForm = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ otp, newPassword }: { otp: string; newPassword: string }) =>
			resetPasswordAction(email, otp, newPassword),
	});

	const form = useForm({
		defaultValues: { newPassword: "", confirmPassword: "" },
		onSubmit: async ({ value }) => {
			setServerError(null);
			if (otp.join("").length !== 6) {
				setServerError("Please enter the complete 6-digit OTP");
				return;
			}
			try {
				const result = (await mutateAsync({
					otp: otp.join(""),
					newPassword: value.newPassword,
				})) as any;
				if (result && !result.success) {
					setServerError(result.message || "Failed to reset password");
				}
			} catch (error: any) {
				setServerError(error.message || "Failed to reset password");
			}
		},
	});

	const handleChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);
		if (value && index < 5) inputRefs.current[index + 1]?.focus();
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		if (pastedData.length === 6) {
			setOtp(pastedData.split(""));
			inputRefs.current[5]?.focus();
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-sm bg-card border border-border rounded-2xl p-10">
				<div className="text-center mb-6">
					<div className="flex justify-center mb-8">
						<Logo />
					</div>

					<div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
						<LockKeyhole className="size-6 text-destructive" />
					</div>

					<h3 className="text-lg font-semibold text-foreground mb-1">Reset password</h3>
					<p className="text-sm text-muted-foreground">Enter the OTP sent to</p>
					<p className="text-sm font-medium text-foreground mt-0.5">{email}</p>
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
					<div>
						<Label className="text-center block mb-3 text-xs text-muted-foreground">Enter OTP</Label>
						<div className="flex gap-2 justify-center" onPaste={handlePaste}>
							{otp.map((digit, index) => (
								<Input
									key={index}
									ref={(el) => {
										inputRefs.current[index] = el;
									}}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className={`w-11 h-12 text-center text-lg font-semibold p-0 ${digit ? "border-destructive" : ""}`}
								/>
							))}
						</div>
					</div>

					<form.Field name="newPassword" validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}>
						{(field) => (
							<AppField
								field={field}
								label="New Password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter new password"
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

					<form.Field name="confirmPassword" validators={{ onChange: resetPasswordZodSchema.shape.confirmPassword }}>
						{(field) => (
							<AppField
								field={field}
								label="Confirm Password"
								type={showConfirm ? "text" : "password"}
								placeholder="Confirm new password"
								append={
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="pointer-events-auto"
										onClick={() => setShowConfirm((v) => !v)}
									>
										{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
									</Button>
								}
							/>
						)}
					</form.Field>

					{serverError && (
						<Alert variant="destructive">
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}

					<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
						{([canSubmit, isSubmitting]) => (
							<AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Resetting..." disabled={!canSubmit}>
								Reset Password
							</AppSubmitButton>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
