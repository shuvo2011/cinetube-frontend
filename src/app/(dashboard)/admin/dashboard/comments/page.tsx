import AdminCommentsTable from "@/components/modules/AdminComments/AdminCommentsTable";

export const metadata = {
	title: "Comments - Moderate User Reviews - CineTube Admin",
	description:
		"Moderate user comments and reviews on movies and series. Approve, flag, or delete inappropriate content. Manage community discussions on CineTube.",
};

export const dynamic = "force-dynamic";

interface Props {
	searchParams: Promise<Record<string, string>>;
}

const AdminDashboardCommentsPage = async ({ searchParams }: Props) => {
	const sp = await searchParams;
	const initialQueryString = new URLSearchParams(sp).toString();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Comments</h1>
				<p className="text-[13px] text-text-muted mt-1">Manage and moderate user comments</p>
			</div>
			<AdminCommentsTable initialQueryString={initialQueryString} />
		</div>
	);
};

export default AdminDashboardCommentsPage;
