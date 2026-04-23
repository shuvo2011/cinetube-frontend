"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getMyWatchlistItems, IWatchlistItem, removeFromWatchlistAction } from "@/services/watchlist.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { watchlistColumns } from "./watchlistColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const WatchlistTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const [removingId, setRemovingId] = useState<string | null>(null);

	const {
		queryStringFromUrl,
		optimisticSortingState,
		optimisticPaginationState,
		isRouteRefreshPending,
		handleSortingChange,
		handlePaginationChange,
	} = useServerManagedDataTable({
		searchParams,
		defaultPage: DEFAULT_PAGE,
		defaultLimit: DEFAULT_LIMIT,
	});

	const queryString = queryStringFromUrl || initialQueryString;

	const {
		data: watchlistResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["watchlist", queryString],
		queryFn: () => getMyWatchlistItems(queryString),
	});

	const items: IWatchlistItem[] = watchlistResponse?.data ?? [];
	const meta: PaginationMeta | undefined = watchlistResponse?.meta;

	const handleRemove = async (item: IWatchlistItem) => {
		if (!confirm(`Remove "${item.movie.title}" from your watchlist?`)) return;

		setRemovingId(item.movieId);

		try {
			const res = await removeFromWatchlistAction(item.movieId);
			if (!res?.success) return;

			queryClient.invalidateQueries({ queryKey: ["watchlist"] });
		} finally {
			setRemovingId(null);
		}
	};

	return (
		<DataTable
			data={items}
			columns={watchlistColumns}
			isLoading={isLoading || isFetching || isRouteRefreshPending || removingId !== null}
			emptyMessage="Your watchlist is empty."
			sorting={{
				state: optimisticSortingState,
				onSortingChange: handleSortingChange,
			}}
			pagination={{
				state: optimisticPaginationState,
				onPaginationChange: handlePaginationChange,
			}}
			meta={meta}
			actions={{ onDelete: handleRemove }}
		/>
	);
};

export default WatchlistTable;
