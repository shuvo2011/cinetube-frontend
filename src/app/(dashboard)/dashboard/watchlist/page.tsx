import WatchlistTable from "@/components/modules/Watchlist/WatchlistTable";

export const metadata = {
	title: "My Watchlists - Saved Movies & Series | CineTube",
	description:
		"View and manage your watchlists on CineTube. Save movies and TV series to watch later, organize your queue, and keep track of what you want to watch.",
};

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
