"use client";

import CommonLoader from "@/components/shared/CommonLoader";
import { getCommentsForAdmin } from "@/services/comment.services";
import { approveReview, getReviewsForAdmin, IAdminReview } from "@/services/review.services";
import { getDashboardStats } from "@/services/stats.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Film, LucideIcon, Star, Users } from "lucide-react";
import Link from "next/link";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const BRAND = "#EF4C5C";
const GREEN = "#16A34A";
const BLUE = "#3B82F6";
const YELLOW = "#F5A623";
const PURPLE = "#8B5CF6";
const TEAL = "#06B6D4";
const ORANGE = "#F97316";

const GENRE_COLORS = [BRAND, YELLOW, BLUE, GREEN, PURPLE, ORANGE, TEAL];
const PLATFORM_COLORS = [BRAND, BLUE, PURPLE, "#1C1C1C", "#00A8E0", TEAL];

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n));
const fmtUSD = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const today = new Date().toLocaleDateString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

const formatTooltipValue = (value: ValueType | undefined) => {
	if (Array.isArray(value)) return value.join(", ");
	return String(value ?? "");
};

const Avatar = ({ name }: { name: string }) => {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	const colors = ["bg-brand", "bg-blue-500", "bg-green", "bg-yellow", "bg-purple-500"];
	const color = colors[name.charCodeAt(0) % colors.length];
	return (
		<span
			className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[10px] font-bold shrink-0 ${color}`}
		>
			{initials}
		</span>
	);
};

const SummaryCard = ({
	label,
	value,
	sub,
	subPositive,
	bgColor,
	Icon, // ✅ add this
}: {
	label: string;
	value: string;
	sub: string;
	subPositive?: boolean;
	bgColor: string;
	Icon: LucideIcon; // ✅ type
}) => (
	<div className="bg-bg border border-line rounded-xl p-5">
		<div className={`w-10 h-10 rounded-xl ${bgColor} mb-3 flex items-center justify-center`}>
			<Icon className="w-5 h-5 text-ink" /> {/* ✅ icon show */}
		</div>

		<p className="text-[24px] font-bold text-ink leading-none">{value}</p>
		<p className="text-[12px] text-text-muted mt-1">{label}</p>

		{sub && (
			<p className={`text-[11px] mt-1 font-medium ${subPositive === false ? "text-brand" : "text-green"}`}>{sub}</p>
		)}
	</div>
);

const ActionCard = ({
	label,
	subtitle,
	count,
	dotColor,
	btnLabel,
	btnStyle,
	href,
}: {
	label: string;
	subtitle: string;
	count: number;
	dotColor: string;
	btnLabel: string;
	btnStyle: string;
	href: string;
}) => (
	<div className="bg-bg border border-line rounded-xl p-5 flex items-center justify-between">
		<div>
			<div className="flex items-center gap-1.5 mb-0.5">
				<span className={`w-2 h-2 rounded-full ${dotColor}`} />
				<p className="text-[13px] font-semibold text-ink">{label}</p>
			</div>
			<p className="text-[11px] text-text-muted">{subtitle}</p>
			<Link href={href}>
				<button className={`mt-3 text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors ${btnStyle}`}>
					{btnLabel}
				</button>
			</Link>
		</div>
		<span className="text-[36px] font-bold text-ink">{count}</span>
	</div>
);

const PendingReviewRow = ({ review, onAction }: { review: IAdminReview; onAction: () => void }) => {
	const handleApprove = async () => {
		await approveReview(review.id, "PUBLISHED");
		onAction();
	};

	const handleReject = async () => {
		await approveReview(review.id, "UNPUBLISHED");
		onAction();
	};

	return (
		<tr className="border-b border-line-2 last:border-0">
			<td className="py-3 pr-4">
				<div className="flex items-center gap-2">
					<Avatar name={review.user.name} />
					<span className="text-[13px] text-ink font-medium">{review.user.name}</span>
				</div>
			</td>
			<td className="py-3 pr-4 text-[13px] text-text-base">{review.movie.title}</td>
			<td className="py-3 pr-4 text-[13px] text-ink">★ {review.rating}/10</td>
			<td className="py-3 pr-4 text-[12px] text-text-muted">
				{new Date(review.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</td>
			<td className="py-3 pr-4">
				<span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow/10 text-yellow">Pending</span>
			</td>
			<td className="py-3">
				<div className="flex gap-2">
					<button
						onClick={handleApprove}
						className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-green/10 text-green hover:bg-green/20 transition-colors"
					>
						✓ Approve
					</button>
					<button
						onClick={handleReject}
						className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
					>
						✕ Reject
					</button>
				</div>
			</td>
		</tr>
	);
};

const AdminDashboardClient = () => {
	const queryClient = useQueryClient();

	const { data: commentsRes } = useQuery({
		queryKey: ["admin-comments-count"],
		queryFn: () => getCommentsForAdmin("page=1&limit=1"),
	});
	const totalComments = commentsRes?.meta?.total ?? 0;

	const { data: statsRes, isLoading } = useQuery({
		queryKey: ["admin-dashboard-stats"],
		queryFn: getDashboardStats,
	});

	const { data: pendingRes } = useQuery({
		queryKey: ["admin-reviews-pending-dashboard"],
		queryFn: () => getReviewsForAdmin("status=PENDING&limit=5&page=1"),
	});

	const stats = statsRes?.data;
	const pendingReviews: IAdminReview[] = pendingRes?.data ?? [];

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
		queryClient.invalidateQueries({ queryKey: ["admin-reviews-pending-dashboard"] });
	};

	if (isLoading) {
		return <CommonLoader />;
	}

	const totalReviews =
		(stats?.reviewStats.pending ?? 0) +
		(stats?.reviewStats.published ?? 0) +
		(stats?.reviewStats.draft ?? 0) +
		(stats?.reviewStats.unpublished ?? 0);

	const lastMonthRevenue = stats?.paymentStats.monthlyRevenue.at(-1)?.revenue ?? 0;
	const maxRevenue = Math.max(...(stats?.paymentStats.monthlyRevenue ?? []).map((m) => m.revenue), 1);
	const maxPlatform = Math.max(...(stats?.platformDistribution ?? []).map((p) => p.count), 1);
	const totalGenreCount = stats?.genreDistribution.reduce((s, g) => s + g.count, 0) ?? 1;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Admin Dashboard</h1>
				<p className="text-[13px] text-text-muted mt-0.5">Platform overview — {today}</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<SummaryCard
					label="Total Movies"
					value={fmt(stats?.summary.totalMovies ?? 0)}
					sub={`+${stats?.summary.featuredMoviesCount ?? 0} featured`}
					bgColor="bg-brand-soft"
					Icon={Film}
				/>
				<SummaryCard
					label="Total Users"
					value={fmtK(stats?.summary.totalUsers ?? 0)}
					sub={`+${fmt(stats?.userStats.newUsersLast30Days ?? 0)} this month`}
					subPositive={true}
					bgColor="bg-[#F0FDF4]"
					Icon={Users}
				/>
				<SummaryCard
					label="Total Reviews"
					value={fmt(totalReviews)}
					sub={`+${fmt(stats?.reviewStats.pending ?? 0)} pending`}
					subPositive={true}
					bgColor="bg-[#FEFCE8]"
					Icon={Star}
				/>
				<SummaryCard
					label="Monthly Revenue"
					value={fmtUSD(lastMonthRevenue)}
					sub="+18% vs last month"
					subPositive={true}
					bgColor="bg-[#F5F3FF]"
					Icon={DollarSign}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<ActionCard
					label="Pending Reviews"
					subtitle="Awaiting approval"
					count={stats?.reviewStats.pending ?? 0}
					dotColor="bg-yellow"
					btnLabel="Review Now"
					btnStyle="bg-yellow/10 text-yellow hover:bg-yellow/20"
					href="/admin/dashboard/reviews"
				/>
				<ActionCard
					label="Comments"
					subtitle="Review user discussions"
					count={totalComments}
					dotColor="bg-blue-500"
					btnLabel="View All"
					btnStyle="bg-blue-100 text-blue-600 hover:bg-blue-200"
					href="/admin/dashboard/comments"
				/>
				<ActionCard
					label="New Subscribers"
					subtitle="Last 7 days"
					count={stats?.userStats.newSubscribersLast7Days ?? 0}
					dotColor="bg-green"
					btnLabel="View All"
					btnStyle="bg-green/10 text-green hover:bg-green/20"
					href="/admin/dashboard/users"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="bg-bg border border-line rounded-xl p-5">
					<div className="flex items-start justify-between mb-4">
						<div>
							<p className="text-[14px] font-semibold text-ink">Revenue Trend</p>
							<p className="text-[12px] text-text-muted">Last 6 months</p>
						</div>
						<div className="text-right">
							<span className="text-[20px] font-bold text-ink">{fmtUSD(lastMonthRevenue)}</span>
							<span className="ml-2 text-[11px] font-medium text-green bg-[#F0FDF4] px-2 py-0.5 rounded-full">
								+18%
							</span>
						</div>
					</div>
					<ResponsiveContainer width="100%" height={180}>
						<AreaChart
							data={stats?.paymentStats.monthlyRevenue ?? []}
							margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
						>
							<defs>
								<linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
									<stop offset="95%" stopColor={BRAND} stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#EAEAEE" vertical={false} />
							<XAxis
								dataKey="month"
								tick={{ fontSize: 10, fill: "#9CA0A8" }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(v: string) => v.split(" ")[0]}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: "#9CA0A8" }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(v: number) => `$${v}`}
							/>
							<Tooltip
								formatter={(value: ValueType | undefined, name: NameType | undefined) => {
									const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
									return [fmtUSD(numericValue), String(name ?? "Revenue")];
								}}
								contentStyle={{ borderRadius: 8, border: "1px solid #EAEAEE", fontSize: 12 }}
							/>
							<Area type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2} fill="url(#revenueGrad)" />
						</AreaChart>
					</ResponsiveContainer>
				</div>

				<div className="bg-bg border border-line rounded-xl p-5">
					<div className="flex items-start justify-between mb-4">
						<div>
							<p className="text-[14px] font-semibold text-ink">User Growth</p>
							<p className="text-[12px] text-text-muted">Monthly</p>
						</div>
						<div className="text-right">
							<span className="text-[20px] font-bold text-ink">{fmtK(stats?.summary.totalUsers ?? 0)}</span>
							<span className="ml-2 text-[11px] font-medium text-green bg-[#F0FDF4] px-2 py-0.5 rounded-full">
								+12%
							</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 mt-2">
						{[
							{ label: "Total Users", value: fmt(stats?.summary.totalUsers ?? 0), color: "text-ink" },
							{ label: "Active Users", value: fmt(stats?.summary.activeUsers ?? 0), color: "text-green" },
							{
								label: "Active Subscribers",
								value: fmt(stats?.summary.activeSubscribers ?? 0),
								color: "text-blue-500",
							},
							{ label: "Blocked Users", value: fmt(stats?.summary.blockedUsers ?? 0), color: "text-brand" },
							{ label: "New (Last 7d)", value: fmt(stats?.userStats.newUsersLast7Days ?? 0), color: "text-yellow" },
							{
								label: "New (Last 30d)",
								value: fmt(stats?.userStats.newUsersLast30Days ?? 0),
								color: "text-purple-500",
							},
						].map(({ label, value, color }) => (
							<div key={label} className="bg-bg-2 rounded-lg px-3 py-2.5">
								<p className={`text-[16px] font-bold ${color}`}>{value}</p>
								<p className="text-[11px] text-text-muted mt-0.5">{label}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-bg border border-line rounded-xl p-5">
					<p className="text-[14px] font-semibold text-ink mb-3">Genre Distribution</p>
					<div className="flex items-center gap-3">
						<ResponsiveContainer width={110} height={110}>
							<PieChart>
								<Pie
									data={stats?.genreDistribution ?? []}
									cx="50%"
									cy="50%"
									innerRadius={32}
									outerRadius={52}
									dataKey="count"
									nameKey="genre"
									strokeWidth={0}
								>
									{(stats?.genreDistribution ?? []).map((_, i) => (
										<Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									formatter={(value: ValueType | undefined, name: NameType | undefined) => [
										formatTooltipValue(value),
										String(name ?? ""),
									]}
									contentStyle={{ borderRadius: 8, fontSize: 11 }}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex-1 space-y-1.5 min-w-0">
							{(stats?.genreDistribution ?? []).slice(0, 5).map((item, i) => {
								const pct = Math.round((item.count / totalGenreCount) * 100);
								return (
									<div key={i} className="flex items-center justify-between gap-1.5">
										<div className="flex items-center gap-1.5 min-w-0">
											<span
												className="w-2 h-2 rounded-full shrink-0"
												style={{ backgroundColor: GENRE_COLORS[i % GENRE_COLORS.length] }}
											/>
											<span className="text-[11px] text-text-muted truncate">{item.genre}</span>
										</div>
										<span className="text-[11px] font-semibold text-ink shrink-0">{pct}%</span>
									</div>
								);
							})}
							{(stats?.genreDistribution?.length ?? 0) > 5 && (
								<div className="flex items-center gap-1.5">
									<span className="w-2 h-2 rounded-full bg-text-subtle shrink-0" />
									<span className="text-[11px] text-text-muted">Others</span>
									<span className="text-[11px] font-semibold text-ink ml-auto">
										{100 -
											(stats?.genreDistribution ?? [])
												.slice(0, 5)
												.reduce((s, g) => s + Math.round((g.count / totalGenreCount) * 100), 0)}
										%
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="bg-bg border border-line rounded-xl p-5">
					<div className="flex items-center justify-between mb-3">
						<p className="text-[14px] font-semibold text-ink">Reviews by Day</p>
						<span className="text-[11px] text-text-muted">This week</span>
					</div>
					<ResponsiveContainer width="100%" height={140}>
						<BarChart data={stats?.trendStats.reviewsByDay ?? []} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#EAEAEE" vertical={false} />
							<XAxis
								dataKey="label"
								tick={{ fontSize: 10, fill: "#9CA0A8" }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(v: string) => v.split(",")[0]}
							/>
							<YAxis tick={{ fontSize: 10, fill: "#9CA0A8" }} axisLine={false} tickLine={false} allowDecimals={false} />
							<Tooltip
								formatter={(value: ValueType | undefined, name: NameType | undefined) => [
									formatTooltipValue(value),
									String(name ?? "Reviews"),
								]}
								contentStyle={{ borderRadius: 8, border: "1px solid #EAEAEE", fontSize: 11 }}
							/>
							<Bar dataKey="count" fill={BRAND} radius={[3, 3, 0, 0]} maxBarSize={32} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className="bg-bg border border-line rounded-xl p-5">
					<p className="text-[14px] font-semibold text-ink mb-4">Streaming Platforms</p>
					<div className="space-y-3">
						{(stats?.platformDistribution ?? []).slice(0, 6).map((item, i) => {
							const pct = (item.count / maxPlatform) * 100;
							return (
								<div key={i} className="flex items-center gap-2.5">
									<span className="text-[11px] text-text-muted w-14 shrink-0 truncate">{item.platform}</span>
									<div className="flex-1 bg-line-2 rounded-full h-2.5 overflow-hidden">
										<div
											className="h-2.5 rounded-full transition-all"
											style={{ width: `${pct}%`, backgroundColor: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }}
										/>
									</div>
									<span className="text-[11px] font-semibold text-ink w-5 text-right">{item.count}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<div className="bg-bg border border-line rounded-xl p-5">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-[14px] font-semibold text-ink">Pending Reviews</p>
						<p className="text-[12px] text-text-muted">{stats?.reviewStats.pending ?? 0} awaiting</p>
					</div>
					<Link href="/admin/dashboard/reviews" className="text-[12px] text-brand hover:underline font-medium">
						View all →
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-150">
						<thead>
							<tr className="border-b border-line">
								{["User", "Movie", "Rating", "Submitted", "Status", "Actions"].map((h) => (
									<th
										key={h}
										className="pb-2 pr-4 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pendingReviews.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-8 text-center text-[13px] text-text-muted">
										No pending reviews
									</td>
								</tr>
							) : (
								pendingReviews.map((review) => (
									<PendingReviewRow key={review.id} review={review} onAction={invalidate} />
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
				<div className="bg-bg border border-line rounded-xl p-5">
					<div className="flex items-center justify-between mb-4">
						<p className="text-[14px] font-semibold text-ink">Top Rated Movies</p>
						<Link href="/admin/dashboard/movies" className="text-[12px] text-brand hover:underline font-medium">
							View all →
						</Link>
					</div>
					<div className="space-y-3">
						{(stats?.ratingReports.topRatedTitles ?? []).map((movie, i) => (
							<div key={movie.id} className="flex items-center gap-3">
								<span className="text-[13px] font-bold text-text-subtle w-5 shrink-0">{i + 1}</span>
								<div className="flex-1 min-w-0">
									<p className="text-[13px] font-medium text-ink truncate">{movie.title}</p>
									<p className="text-[11px] text-text-muted">{fmt(movie.totalReviews)} reviews</p>
								</div>
								<span className="text-[13px] font-semibold text-ink shrink-0">★ {movie.averageRating?.toFixed(1)}</span>
							</div>
						))}
						{(stats?.ratingReports.topRatedTitles?.length ?? 0) === 0 && (
							<p className="text-[13px] text-text-muted py-4 text-center">No data yet</p>
						)}
					</div>
				</div>

				<div className="bg-bg border border-line rounded-xl p-5">
					<div className="flex items-center justify-between mb-4">
						<p className="text-[14px] font-semibold text-ink">Monthly Revenue</p>
						<div className="flex items-center gap-2">
							<span className="text-[20px] font-bold text-ink">{fmtUSD(stats?.summary.totalRevenue ?? 0)}</span>
							<span className="text-[11px] font-medium text-green bg-[#F0FDF4] px-2 py-0.5 rounded-full">+18%</span>
						</div>
					</div>
					<div className="space-y-3">
						{(stats?.paymentStats.monthlyRevenue ?? []).map((item) => (
							<div key={item.month} className="flex items-center gap-3">
								<span className="text-[12px] text-text-muted w-8 shrink-0">{item.month.split(" ")[0]}</span>
								<div className="flex-1 bg-line-2 rounded-full h-3 overflow-hidden">
									<div
										className="h-3 rounded-full bg-brand/70 transition-all"
										style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
									/>
								</div>
								<span className="text-[12px] font-semibold text-ink w-16 text-right">{fmtUSD(item.revenue)}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboardClient;
