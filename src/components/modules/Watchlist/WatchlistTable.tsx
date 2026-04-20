"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getMyWatchlistItems, IWatchlistItem } from "@/services/watchlist.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { watchlistColumns } from "./watchlistColumns";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
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
		updateParams,
		handleSortingChange,
		handlePaginationChange,
	} = useServerManagedDataTable({
		searchParams,
		defaultPage: DEFAULT_PAGE,
		defaultLimit: DEFAULT_LIMIT,
	});

	const { searchTermFromUrl, handleDebouncedSearchChange } = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	});

	const queryString = queryStringFromUrl || initialQueryString;

	const { data: watchlistResponse, isLoading, isFetching } = useQuery({
		queryKey: ["watchlist", queryString],
		queryFn: () => getMyWatchlistItems(queryString),
	});

	const items: IWatchlistItem[] = watchlistResponse?.data ?? [];
	const meta: PaginationMeta | undefined = watchlistResponse?.meta;

	const handleRemove = async (item: IWatchlistItem) => {
		if (!confirm(`Remove "${item.movie.title}" from your watchlist?`)) return;
		setRemovingId(item.movieId);
		try {
			await fetch(`${API_BASE}/watchlist/${item.movieId}`, {
				method: "DELETE",
				credentials: "include",
			});
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
			search={{
				initialValue: searchTermFromUrl,
				placeholder: "Search by title...",
				debounceMs: 400,
				onDebouncedChange: handleDebouncedSearchChange,
			}}
			meta={meta}
			actions={{ onDelete: handleRemove }}
		/>
	);
};

export default WatchlistTable;
