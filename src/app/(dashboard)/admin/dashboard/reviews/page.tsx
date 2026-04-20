import AdminReviewsTable from "@/components/modules/AdminReviews/AdminReviewsTable";

export const dynamic = "force-dynamic";

interface Props {
	searchParams: Promise<Record<string, string>>;
}

const AdminDashboardReviewsPage = async ({ searchParams }: Props) => {
	const sp = await searchParams;
	const initialQueryString = new URLSearchParams(sp).toString();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Reviews</h1>
				<p className="text-[13px] text-text-muted mt-1">Manage and moderate user reviews</p>
			</div>
			<AdminReviewsTable initialQueryString={initialQueryString} />
		</div>
	);
};

export default AdminDashboardReviewsPage;
