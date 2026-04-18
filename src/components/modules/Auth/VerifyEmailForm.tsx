/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { resendOtpAction, verifyEmailAction } from "@/app/(auth)/verify-email/_actions";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, KeyboardEvent } from "react";

const RESEND_COOLDOWN = 120; // 2 minutes

const VerifyEmailForm = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [serverError, setServerError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const [countdown, setCountdown] = useState(0);
	const canResend = countdown <= 0;

	useEffect(() => {
		if (countdown <= 0) return;

		const timer = setTimeout(() => {
			setCountdown((c) => c - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countdown]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const { mutateAsync: verifyMutate, isPending: isVerifying } = useMutation({
		mutationFn: () => verifyEmailAction(email, otp.join("")),
	});

	const { mutateAsync: resendMutate, isPending: isResending } = useMutation({
		mutationFn: () => resendOtpAction(email),
	});

	const handleChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError(null);
		setSuccessMessage(null);
		if (otp.join("").length !== 6) {
			setServerError("Please enter the complete 6-digit OTP");
			return;
		}
		try {
			const result = (await verifyMutate()) as any;
			if (result && !result.success) {
				setServerError(result.message || "Verification failed");
			}
		} catch (error: any) {
			setServerError(error.message || "Verification failed");
		}
	};

	const handleResend = async () => {
		if (!canResend) return;
		setServerError(null);
		setSuccessMessage(null);
		try {
			const result = await resendMutate();
			if (result.success) {
				setSuccessMessage("OTP sent! Check your inbox.");
				setCountdown(RESEND_COOLDOWN); // ← এখানে countdown শুরু হবে
				setOtp(["", "", "", "", "", ""]);
				inputRefs.current[0]?.focus();
			} else {
				setServerError(result.message || "Failed to resend OTP");
			}
		} catch (error: any) {
			setServerError(error.message || "Failed to resend OTP");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-sm bg-card border border-border rounded-2xl p-10">
				{/* Logo */}
				<div className="text-center mb-6">
					<div className="text-xl font-medium tracking-wide mb-5">
						<span className="text-foreground">Cine</span>
						<span className="text-destructive">Tube</span>
					</div>

					{/* Icon */}
					<div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
						<Mail className="size-6 text-destructive" />
					</div>

					<h3 className="text-lg font-semibold text-foreground mb-1">Check your inbox</h3>
					<p className="text-sm text-muted-foreground">We sent a 6-digit code to</p>
					<p className="text-sm font-medium text-foreground mt-0.5">{email}</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* OTP Inputs */}
					<div>
						<p className="text-xs text-muted-foreground text-center mb-3">Enter verification code</p>
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

					{serverError && (
						<Alert variant="destructive">
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}

					{successMessage && (
						<Alert>
							<AlertDescription>{successMessage}</AlertDescription>
						</Alert>
					)}

					<AppSubmitButton isPending={isVerifying} pendingLabel="Verifying...">
						Verify Email
					</AppSubmitButton>
				</form>

				{/* Resend */}
				<div className="border-t border-border mt-6 pt-5 text-center">
					<p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
					<div className="flex items-center justify-center gap-2">
						{!canResend ? (
							<>
								<span className="text-xs text-muted-foreground">Resend in</span>
								<span className="text-xs font-semibold text-destructive">{formatTime(countdown)}</span>
							</>
						) : (
							<button
								onClick={handleResend}
								disabled={isResending}
								className="text-sm text-destructive font-medium hover:underline underline-offset-4 disabled:opacity-50"
							>
								{isResending ? "Sending..." : "Resend OTP"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerifyEmailForm;
