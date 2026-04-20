"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getMoviesForAdmin } from "@/services/movie.services";
import { IMovie } from "@/types/movie.types";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { moviesColumns } from "./moviesColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeleteMovieDialog from "./DeleteMovieDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface MoviesTableProps {
	initialQueryString: string;
}

const MoviesTable = ({ initialQueryString }: MoviesTableProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [deletingItem, setDeletingItem] = useState<IMovie | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const {
		queryStringFromUrl,
		optimisticSortingState,
		optimisticPaginationState,
		isRouteRefreshPending,
		updateParams,
		handleSortingChange,
		handlePaginationChange,
	} = useServerManagedDataTable({ searchParams, defaultPage: DEFAULT_PAGE, defaultLimit: DEFAULT_LIMIT });

	const queryString = queryStringFromUrl || initialQueryString;

	const { searchTermFromUrl, handleDebouncedSearchChange } = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	});

	const {
		data: moviesResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["movies", queryString],
		queryFn: () => getMoviesForAdmin(queryString),
	});

	const movies: IMovie[] = moviesResponse?.data ?? [];
	const meta: PaginationMeta | undefined = moviesResponse?.meta;

	const tableActions = {
		onEdit: (item: IMovie) => {
			router.push(`/admin/dashboard/movies/${item.id}/edit`);
		},
		onDelete: (item: IMovie) => {
			setDeletingItem(item);
			setIsDeleteDialogOpen(true);
		},
	};

	const onDeleteOpenChange = (open: boolean) => {
		setIsDeleteDialogOpen(open);
		if (!open) {
			setDeletingItem(null);
		}
	};

	return (
		<>
			<DataTable
				data={movies}
				columns={moviesColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No movies found."
				sorting={{ state: optimisticSortingState, onSortingChange: handleSortingChange }}
				pagination={{ state: optimisticPaginationState, onPaginationChange: handlePaginationChange }}
				search={{
					initialValue: searchTermFromUrl,
					placeholder: "Search by title...",
					debounceMs: 500,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				toolbarAction={
					<Link href="/admin/dashboard/movies/new">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add Movie
						</Button>
					</Link>
				}
				meta={meta}
				actions={tableActions}
			/>

			<DeleteMovieDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange} movie={deletingItem} />
		</>
	);
};

export default MoviesTable;
