"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/stats.services";

const fmtCurrency = (n: number) => `$${n.toFixed(2)}`;

const SummaryCard = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) => (
	<div className="bg-bg border border-line rounded-xl p-4">
		<p className="text-[12px] text-text-muted">{label}</p>
		<p className="text-[20px] font-bold text-ink mt-1">{value}</p>
		{sub && <p className="text-[11px] text-text-muted mt-1">{sub}</p>}
	</div>
);

const UserDashboardClient = () => {
	const { data: res, isLoading } = useQuery({ queryKey: ["user-stats"], queryFn: getUserStats });

	const data = res?.data ?? null;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-48">
				<p className="text-text-muted">Loading your dashboard...</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="p-6 bg-bg border border-line rounded-xl">
				<p className="text-text-muted">No data available.</p>
			</div>
		);
	}

	const { summary, reviewStats, recentActivity } = data;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Dashboard</h1>
				<p className="text-[13px] text-text-muted mt-0.5">Your account overview</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<SummaryCard label="Total Spend" value={fmtCurrency(summary.totalSpend ?? 0)} />
				<SummaryCard label="Rents" value={summary.totalRents ?? 0} />
				<SummaryCard label="Purchases" value={summary.totalPurchases ?? 0} />
				<SummaryCard label="Watchlist" value={summary.watchlistCount ?? 0} sub={summary.subscriptionStatus ?? ""} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-bg border border-line rounded-xl p-4">
					<p className="text-[14px] font-semibold text-ink mb-2">Review Stats</p>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<p className="text-[16px] font-bold">{reviewStats.totalReviews}</p>
							<p className="text-[11px] text-text-muted">Total Reviews</p>
						</div>
						<div>
							<p className="text-[16px] font-bold">{reviewStats.published}</p>
							<p className="text-[11px] text-text-muted">Published</p>
						</div>
						<div>
							<p className="text-[16px] font-bold">{reviewStats.pending}</p>
							<p className="text-[11px] text-text-muted">Pending</p>
						</div>
						<div>
							<p className="text-[16px] font-bold">{reviewStats.averageRatingGiven}</p>
							<p className="text-[11px] text-text-muted">Avg Rating</p>
						</div>
					</div>
				</div>

				<div className="bg-bg border border-line rounded-xl p-4">
					<p className="text-[14px] font-semibold text-ink mb-2">Recent Activity</p>
					{recentActivity.recentReviews?.length ? (
						<div className="space-y-3">
							{recentActivity.recentReviews.map((r: any) => (
								<div key={r.id} className="flex items-center justify-between">
									<div>
										<p className="text-[13px] font-medium text-ink">{r.movie.title}</p>
										<p className="text-[11px] text-text-muted">★ {r.rating}/10</p>
									</div>
									<div className="text-[11px] text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-[13px] text-text-muted">No recent activity</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserDashboardClient;
