import WatchlistTable from "@/components/modules/Watchlist/WatchlistTable";

export const metadata = {
	title: "Watchlists - Manage User Watchlists | CineTube Admin",
	description:
		"View and manage user watchlists. Track what movies and series users are saving for later. Monitor popular content and user engagement on CineTube.",
};

export const dynamic = "force-dynamic";

interface Props {
	searchParams: Promise<Record<string, string>>;
}

const AdminDashboardWatchListPage = async ({ searchParams }: Props) => {
	const sp = await searchParams;
	const initialQueryString = new URLSearchParams(sp).toString();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">My Watchlist</h1>
				<p className="text-[13px] text-text-muted mt-1">Movies you have saved to watch later</p>
			</div>
			<WatchlistTable initialQueryString={initialQueryString} />
		</div>
	);
};
export default AdminDashboardWatchListPage;
