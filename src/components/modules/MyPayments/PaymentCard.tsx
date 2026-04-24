import { IPayment } from "@/services/payment.services";
import Image from "next/image";
import Link from "next/link";
import { Clock, Crown, Play, ShoppingCart } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { DURATION_LABELS, isPaymentActive } from "./paymentUtils";

const PaymentCard = ({ payment }: { payment: IPayment }) => {
	const isSubscription = payment.purchaseType === "SUBSCRIPTION";
	const isRent = payment.purchaseType === "RENT";
	const isBuy = payment.purchaseType === "BUY";
	const isActive = isPaymentActive(payment);
	const canWatch = isActive && !!payment.movie;

	const rentExpired = isRent && payment.rentExpiresAt && new Date(payment.rentExpiresAt) < new Date();
	const subscriptionExpired =
		isSubscription && payment.subscriptionEndsAt && new Date(payment.subscriptionEndsAt) < new Date();

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-5 flex gap-4">
			{payment.movie ? (
				<Link
					href={`/movies/${payment.movie.id}`}
					className="w-14 h-20 rounded-[8px] overflow-hidden shrink-0 bg-bg-2 relative"
				>
					{payment.movie.posterImage ? (
						<Image src={payment.movie.posterImage} alt={payment.movie.title} fill className="object-cover" />
					) : (
						<div className="w-full h-full flex items-center justify-center text-text-subtle">
							<Play size={16} />
						</div>
					)}
				</Link>
			) : (
				<div className="w-14 h-20 rounded-[8px] shrink-0 bg-brand/10 flex items-center justify-center">
					<Crown size={20} className="text-brand" />
				</div>
			)}

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-3 mb-1.5">
					<div>
						{isSubscription ? (
							<p className="text-[14px] font-semibold text-ink">
								{payment.planType === "MONTHLY" ? "Monthly" : "Yearly"} Subscription
							</p>
						) : (
							<Link
								href={`/movies/${payment.movie?.id}`}
								className="block text-[14px] font-semibold text-ink truncate hover:text-brand transition-colors"
							>
								{payment.movie?.title}
							</Link>
						)}

						<div className="flex items-center gap-2 mt-0.5 flex-wrap">
							<span className="text-[12px] text-text-muted flex items-center gap-1">
								{isBuy && (
									<>
										<ShoppingCart size={11} /> Purchased
									</>
								)}
								{isRent && (
									<>
										<Clock size={11} /> Rented{" "}
										{payment.rentalDuration
											? `· ${DURATION_LABELS[payment.rentalDuration] ?? payment.rentalDuration}`
											: ""}
									</>
								)}
								{isSubscription && (
									<>
										<Crown size={11} /> Subscription
									</>
								)}
							</span>
							<StatusBadge status={payment.status} />
						</div>
					</div>

					<span className="text-[15px] font-black text-ink shrink-0">৳{payment.amount}</span>
				</div>

				{isRent && payment.rentExpiresAt && (
					<p className={`text-[12px] mb-2 flex items-center gap-1 ${rentExpired ? "text-red-500" : "text-text-muted"}`}>
						<Clock size={11} />
						{rentExpired ? "Rental expired" : "Expires"}{" "}
						{new Date(payment.rentExpiresAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				)}

				{isSubscription && payment.subscriptionEndsAt && (
					<p
						className={`text-[12px] mb-2 flex items-center gap-1 ${
							subscriptionExpired ? "text-red-500" : "text-text-muted"
						}`}
					>
						<Crown size={11} />
						{subscriptionExpired ? "Expired on" : "Valid until"}{" "}
						{new Date(payment.subscriptionEndsAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				)}

				<div className="flex items-center justify-between mt-2">
					<p className="text-[11px] text-text-subtle">
						{new Date(payment.createdAt).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>

					{canWatch && payment.movie && (
						<Link
							href={`/movies/${payment.movie.id}`}
							className="flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:opacity-80 transition-opacity"
						>
							<Play size={12} className="fill-brand" />
							Watch Now
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentCard;
