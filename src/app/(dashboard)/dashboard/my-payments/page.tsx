import { getMyPayments, IPayment } from "@/services/payment.services";
import Image from "next/image";
import Link from "next/link";
import { Play, Crown, ShoppingCart, Clock, Receipt } from "lucide-react";

export const metadata = {
	title: "My Payments - Transaction History | CineTube",
	description:
		"View your payment history on CineTube. Track monthly and yearly subscriptions, movie rentals, purchases, and download invoices.",
};

export const dynamic = "force-dynamic";

const DURATION_LABELS: Record<string, string> = {
	DAYS_1: "1 Day",
	DAYS_2: "2 Days",
	DAYS_3: "3 Days",
	DAYS_5: "5 Days",
	DAYS_7: "7 Days",
	DAYS_14: "14 Days",
	DAYS_15: "15 Days",
};

const StatusBadge = ({ status }: { status: IPayment["status"] }) => {
	const map = {
		COMPLETED: "bg-green-50 text-green-600 border-green-200",
		PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
		FAILED: "bg-red-50 text-red-500 border-red-200",
		REFUNDED: "bg-gray-50 text-gray-500 border-gray-200",
	};

	return <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${map[status]}`}>{status}</span>;
};

const PaymentCard = ({ payment }: { payment: IPayment }) => {
	const isSubscription = payment.purchaseType === "SUBSCRIPTION";
	const isRent = payment.purchaseType === "RENT";
	const isBuy = payment.purchaseType === "BUY";
	const isCompleted = payment.status === "COMPLETED";

	const rentExpired = isRent && payment.rentExpiresAt && new Date(payment.rentExpiresAt) < new Date();
	const subscriptionExpired =
		isSubscription && payment.subscriptionEndsAt && new Date(payment.subscriptionEndsAt) < new Date();

	const isActive = isCompleted && (isBuy || (isRent && !rentExpired) || (isSubscription && !subscriptionExpired));
	const canWatch = isActive && !!payment.movie;

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-5 flex gap-4">
			{payment.movie ? (
				<div className="w-14 h-20 rounded-[8px] overflow-hidden shrink-0 bg-bg-2 relative">
					{payment.movie.posterImage ? (
						<div className="relative w-14 h-20">
							<Image src={payment.movie.posterImage} alt={payment.movie.title} fill className="object-cover" />
						</div>
					) : (
						<div className="w-full h-full flex items-center justify-center text-text-subtle">
							<Play size={16} />
						</div>
					)}
				</div>
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
							<p className="text-[14px] font-semibold text-ink truncate">{payment.movie?.title}</p>
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

const PaymentHistoryTable = ({ payments }: { payments: IPayment[] }) => {
	return (
		<div className="bg-white rounded-[14px] border border-line-2 overflow-hidden">
			<div className="px-5 py-4 border-b border-line-2">
				<h2 className="text-[15px] font-semibold text-ink">Payment History</h2>
				<p className="text-[12px] text-text-muted mt-1">
					Your recent transactions, subscriptions, rentals, and purchases.
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px]">
					<thead>
						<tr className="border-b border-line-2 bg-bg/40">
							<th className="text-left px-5 py-3 text-[12px] font-semibold text-text-muted">Item</th>
							<th className="text-left px-5 py-3 text-[12px] font-semibold text-text-muted">Type</th>
							<th className="text-left px-5 py-3 text-[12px] font-semibold text-text-muted">Status</th>
							<th className="text-left px-5 py-3 text-[12px] font-semibold text-text-muted">Amount</th>
							<th className="text-left px-5 py-3 text-[12px] font-semibold text-text-muted">Date</th>
							<th className="text-right px-5 py-3 text-[12px] font-semibold text-text-muted">Action</th>
						</tr>
					</thead>

					<tbody>
						{payments.map((payment) => {
							const isSubscription = payment.purchaseType === "SUBSCRIPTION";
							const isRent = payment.purchaseType === "RENT";
							const isBuy = payment.purchaseType === "BUY";

							const rentExpired = isRent && payment.rentExpiresAt && new Date(payment.rentExpiresAt) < new Date();
							const subscriptionExpired =
								isSubscription && payment.subscriptionEndsAt && new Date(payment.subscriptionEndsAt) < new Date();

							const canWatch =
								payment.status === "COMPLETED" &&
								payment.movie &&
								(isBuy || (isRent && !rentExpired) || (isSubscription && !subscriptionExpired));

							return (
								<tr key={payment.id} className="border-b border-line-2 last:border-b-0">
									<td className="px-5 py-4">
										<div className="flex items-center gap-3">
											{payment.movie ? (
												<div className="relative w-10 h-14 rounded-md overflow-hidden bg-bg-2 shrink-0">
													{payment.movie.posterImage ? (
														<Image
															src={payment.movie.posterImage}
															alt={payment.movie.title}
															fill
															className="object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center text-text-subtle">
															<Play size={12} />
														</div>
													)}
												</div>
											) : (
												<div className="w-10 h-14 rounded-md bg-brand/10 flex items-center justify-center shrink-0">
													<Crown size={16} className="text-brand" />
												</div>
											)}

											<div className="min-w-0">
												<p className="text-[13px] font-semibold text-ink truncate">
													{isSubscription
														? `${payment.planType === "MONTHLY" ? "Monthly" : "Yearly"} Subscription`
														: payment.movie?.title}
												</p>
												<p className="text-[11px] text-text-muted mt-0.5">
													{isBuy && "Purchase"}
													{isRent &&
														`Rental${
															payment.rentalDuration
																? ` · ${DURATION_LABELS[payment.rentalDuration] ?? payment.rentalDuration}`
																: ""
														}`}
													{isSubscription && "Subscription"}
												</p>
											</div>
										</div>
									</td>

									<td className="px-5 py-4 text-[12px] text-text-muted">{payment.purchaseType}</td>

									<td className="px-5 py-4">
										<StatusBadge status={payment.status} />
									</td>

									<td className="px-5 py-4 text-[13px] font-semibold text-ink">৳{payment.amount}</td>

									<td className="px-5 py-4 text-[12px] text-text-muted">
										{new Date(payment.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>

									<td className="px-5 py-4 text-right">
										{canWatch && payment.movie ? (
											<Link
												href={`/movies/${payment.movie.id}`}
												className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:opacity-80 transition-opacity"
											>
												<Play size={12} className="fill-brand" />
												Watch
											</Link>
										) : (
											<span className="text-[12px] text-text-subtle">—</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const DashboardMyPaymentPage = async () => {
	const payments = await getMyPayments();

	const activePayments = payments.filter((payment) => {
		const isCompleted = payment.status === "COMPLETED";
		if (!isCompleted) return false;

		if (payment.purchaseType === "BUY") return true;

		if (payment.purchaseType === "RENT") {
			if (!payment.rentExpiresAt) return false;
			return new Date(payment.rentExpiresAt) >= new Date();
		}

		if (payment.purchaseType === "SUBSCRIPTION") {
			if (!payment.subscriptionEndsAt) return false;
			return new Date(payment.subscriptionEndsAt) >= new Date();
		}

		return false;
	});

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			<div>
				<h1 className="text-[22px] font-bold text-ink">My Payments</h1>
				<p className="text-[13px] text-text-muted mt-1">View your purchase history and streaming links</p>
			</div>

			{payments.length === 0 ? (
				<div className="bg-white rounded-[14px] border border-line-2 p-10 text-center">
					<Receipt size={32} className="text-text-subtle mx-auto mb-3" />
					<p className="text-[15px] font-semibold text-ink mb-1">No payments yet</p>
					<p className="text-[13px] text-text-muted">Your purchase history will appear here.</p>
					<Link
						href="/movies"
						className="inline-block mt-4 bg-brand text-white text-[13px] font-semibold px-5 py-2.5 rounded-[10px] hover:bg-brand/90 transition-colors"
					>
						Browse Movies
					</Link>
				</div>
			) : (
				<>
					{activePayments.length > 0 && (
						<div className="space-y-3">
							<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase px-1">Active</p>
							{activePayments.map((payment) => (
								<PaymentCard key={payment.id} payment={payment} />
							))}
						</div>
					)}

					<PaymentHistoryTable payments={payments} />
				</>
			)}
		</div>
	);
};

export default DashboardMyPaymentPage;
