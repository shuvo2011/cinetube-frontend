import AdminPaymentsTable from "@/components/modules/AdminPayments/AdminPaymentsTable";
import { Suspense } from "react";

export default async function AdminDashboardPaymentsPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const resolvedParams = await searchParams;
	const initialQueryString = new URLSearchParams(resolvedParams).toString();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Payments</h1>
				<p className="text-[13px] text-text-muted mt-0.5">View all payment transactions</p>
			</div>
			<Suspense>
				<AdminPaymentsTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
