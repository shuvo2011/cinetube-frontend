import WatchlistTable from "@/components/modules/Watchlist/WatchlistTable";

export const dynamic = "force-dynamic";

interface Props {
	searchParams: Promise<Record<string, string>>;
}

const DashboardWatchlistPage = async ({ searchParams }: Props) => {
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

export default DashboardWatchlistPage;
