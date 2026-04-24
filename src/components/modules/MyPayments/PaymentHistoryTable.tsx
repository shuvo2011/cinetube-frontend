import { IPayment } from "@/services/payment.services";
import Image from "next/image";
import Link from "next/link";
import { Crown, Play } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { DURATION_LABELS, isPaymentActive } from "./paymentUtils";

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
				<table className="w-full">
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
							const canWatch = isPaymentActive(payment) && !!payment.movie;

							return (
								<tr key={payment.id} className="border-b border-line-2 last:border-b-0">
									<td className="px-5 py-4">
										<div className="flex items-center gap-3">
											{payment.movie ? (
												<Link
													href={`/movies/${payment.movie.id}`}
													className="relative w-10 h-14 rounded-md overflow-hidden bg-bg-2 shrink-0"
												>
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
												</Link>
											) : (
												<div className="w-10 h-14 rounded-md bg-brand/10 flex items-center justify-center shrink-0">
													<Crown size={16} className="text-brand" />
												</div>
											)}

											<div className="min-w-0">
												{isSubscription ? (
													<p className="text-[13px] font-semibold text-ink truncate">
														{payment.planType === "MONTHLY" ? "Monthly" : "Yearly"} Subscription
													</p>
												) : (
													<Link
														href={`/movies/${payment.movie?.id}`}
														className="block text-[13px] font-semibold text-ink truncate hover:text-brand transition-colors"
													>
														{payment.movie?.title}
													</Link>
												)}

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

export default PaymentHistoryTable;
