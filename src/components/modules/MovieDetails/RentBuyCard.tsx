"use client";

import { cn } from "@/lib/utils";
import { IMovie } from "@/types/movie.types";
import { RentalDuration } from "@/types/enums.types";
import { IMovieAccess } from "@/services/payment.services";
import { ShoppingCart, Clock, BadgeCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DURATION_LABELS: Record<RentalDuration, string> = {
	DAYS_1: "1 Day",
	DAYS_2: "2 Days",
	DAYS_3: "3 Days",
	DAYS_5: "5 Days",
	DAYS_7: "7 Days",
	DAYS_14: "14 Days",
	DAYS_15: "15 Days",
};

interface Props {
	movie: IMovie;
	access: IMovieAccess | null;
	isLoggedIn: boolean;
}

const RentBuyCard = ({ movie, access, isLoggedIn }: Props) => {
	const rentDuration = movie.rentDuration as RentalDuration | null;
	const [loadingType, setLoadingType] = useState<"RENT" | "BUY" | null>(null);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const handlePageShow = (e: PageTransitionEvent) => {
			if (e.persisted) window.location.reload();
		};
		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, []);

	const handleCheckout = async (purchaseType: "RENT" | "BUY") => {
		setLoadingType(purchaseType);
		setError("");
		try {
			const res = await fetch(`${API_BASE}/payments/checkout`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					movieId: movie.id,
					purchaseType,
					...(purchaseType === "RENT" && rentDuration && { rentalDuration: rentDuration }),
				}),
			});
			const data = await res.json();
			if (res.ok && data.data?.checkoutUrl) {
				window.location.href = data.data.checkoutUrl;
			} else {
				setError(data.message ?? "Checkout failed. Please try again.");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoadingType(null);
		}
	};

	if (access?.hasAccess) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-5">
				<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Access</p>
				<div className="flex items-start gap-3">
					<div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
						<BadgeCheck size={18} className="text-green-500" />
					</div>
					<div>
						{access.accessType === "SUBSCRIPTION" && (
							<>
								<p className="text-[14px] font-semibold text-ink">Active Subscription</p>
								<p className="text-[12px] text-text-muted mt-0.5">You have full access via subscription</p>
							</>
						)}
						{access.accessType === "BOUGHT" && (
							<>
								<p className="text-[14px] font-semibold text-ink">Purchased</p>
								<p className="text-[12px] text-text-muted mt-0.5">You own this movie permanently</p>
							</>
						)}
						{access.accessType === "RENTED" && (
							<>
								<p className="text-[14px] font-semibold text-ink">Rented</p>
								{access.expiresAt && (
									<p className="text-[12px] text-text-muted mt-0.5 flex items-center gap-1">
										<Clock size={11} />
										Expires{" "}
										{new Date(access.expiresAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-5">
				<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Get Access</p>
				<div className="space-y-2.5 mb-4">
					{movie.rentPrice > 0 && (
						<div className="flex items-center justify-between text-[13px]">
							<span className="text-text-muted flex items-center gap-1.5">
								<Clock size={13} /> Rent
							</span>
							<span className="font-semibold text-ink">৳ {movie.rentPrice}</span>
						</div>
					)}
					{movie.buyPrice > 0 && (
						<div className="flex items-center justify-between text-[13px]">
							<span className="text-text-muted flex items-center gap-1.5">
								<ShoppingCart size={13} /> Buy
							</span>
							<span className="font-semibold text-ink">৳ {movie.buyPrice}</span>
						</div>
					)}
				</div>
				<Link
					href="/login"
					className="block w-full text-center bg-brand text-white text-[13px] font-semibold px-4 py-2.5 rounded-[10px] hover:bg-brand/90 transition-colors"
				>
					Login to Rent or Buy
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-5">
			<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Get Access</p>

			<div className="space-y-4">
				{movie.rentPrice > 0 && (
					<div className="border border-line rounded-[10px] p-3.5">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
								<Clock size={14} className="text-brand" />
								Rent
							</div>
							<span className="text-[15px] font-black text-ink">৳ {movie.rentPrice}</span>
						</div>
						{rentDuration && (
							<div className="flex items-center gap-1.5 text-[12px] text-text-muted mb-3">
								<Clock size={11} />
								Access for <span className="font-semibold text-ink">{DURATION_LABELS[rentDuration]}</span>
							</div>
						)}
						<button
							onClick={() => handleCheckout("RENT")}
							disabled={loadingType !== null}
							className={cn(
								"w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-[8px] transition-colors",
								"bg-brand/10 text-brand hover:bg-brand hover:text-white disabled:opacity-50",
							)}
						>
							{loadingType === "RENT" ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
							Rent Now
						</button>
					</div>
				)}

				{movie.buyPrice > 0 && (
					<div className="border border-line rounded-[10px] p-3.5">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
								<ShoppingCart size={14} className="text-brand" />
								Buy
							</div>
							<span className="text-[15px] font-black text-ink">৳ {movie.buyPrice}</span>
						</div>
						<p className="text-[11px] text-text-muted mb-3">Own this movie permanently</p>
						<button
							onClick={() => handleCheckout("BUY")}
							disabled={loadingType !== null}
							className={cn(
								"w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-[8px] transition-colors",
								"bg-brand text-white hover:bg-brand/90 disabled:opacity-50",
							)}
						>
							{loadingType === "BUY" ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
							Buy Now
						</button>
					</div>
				)}
			</div>
			{error && <p className="text-[12px] text-red-500 mt-3">{error}</p>}
		</div>
	);
};

export default RentBuyCard;
