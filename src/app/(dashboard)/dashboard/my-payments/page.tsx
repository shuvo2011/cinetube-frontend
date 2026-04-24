import { getMyPayments } from "@/services/payment.services";
import Link from "next/link";
import { Receipt } from "lucide-react";
import PaymentCard from "@/components/modules/MyPayments/PaymentCard";
import PaymentHistoryTable from "@/components/modules/MyPayments/PaymentHistoryTable";
import { isPaymentActive } from "@/components/modules/MyPayments/paymentUtils";

export const metadata = {
	title: "My Payments - Transaction History | CineTube",
	description:
		"View your payment history on CineTube. Track monthly and yearly subscriptions, movie rentals, purchases, and download invoices.",
};

export const dynamic = "force-dynamic";

const DashboardMyPaymentPage = async () => {
	const payments = await getMyPayments();
	const activePayments = payments.filter(isPaymentActive);

	return (
		<div className="space-y-8">
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
