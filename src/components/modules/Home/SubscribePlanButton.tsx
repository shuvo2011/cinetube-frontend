"use client";

import { cn } from "@/lib/utils";
import { createSubscription } from "@/services/payment.services";
import { BadgeCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
	planType: "MONTHLY" | "YEARLY" | null;
	isLoggedIn: boolean;
	hasActiveSub: boolean;
	highlighted: boolean;
}

const SubscribePlanButton = ({ planType, isLoggedIn, hasActiveSub, highlighted }: Props) => {
	const [loading, setLoading] = useState(false);

	if (!planType) {
		return (
			<Link
				href="/register"
				className={cn(
					"block text-center font-semibold text-sm py-3.5 rounded-[10px] transition-colors",
					"bg-bg border border-line hover:bg-line-2 text-ink",
				)}
			>
				Get Started
			</Link>
		);
	}

	if (hasActiveSub) {
		return (
			<div
				className={cn(
					"flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-[10px]",
					highlighted ? "bg-white/10 text-white/60" : "bg-green-50 text-green-600 border border-green-200",
				)}
			>
				<BadgeCheck size={15} />
				Subscribed
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<Link
				href="/login"
				className={cn(
					"block text-center font-semibold text-sm py-3.5 rounded-[10px] transition-colors",
					highlighted ? "bg-brand hover:bg-brand/90 text-white" : "bg-bg border border-line hover:bg-line-2 text-ink",
				)}
			>
				{planType === "MONTHLY" ? "Subscribe Now" : "Subscribe Yearly"}
			</Link>
		);
	}

	const handleSubscribe = async () => {
		setLoading(true);
		try {
			const res = await createSubscription(planType);

			if (res?.success && res.data?.checkoutUrl) {
				window.location.href = res.data.checkoutUrl;
			}
		} catch (err: any) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleSubscribe}
			disabled={loading}
			className={cn(
				"w-full flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-[10px] transition-colors disabled:opacity-70 cursor-pointer",
				highlighted ? "bg-brand hover:bg-brand/90 text-white" : "bg-bg border border-line hover:bg-line-2 text-ink",
			)}
		>
			{loading && <Loader2 size={14} className="animate-spin" />}
			{planType === "MONTHLY" ? "Subscribe Now" : "Subscribe Yearly"}
		</button>
	);
};

export default SubscribePlanButton;
