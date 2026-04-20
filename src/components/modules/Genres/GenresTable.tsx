"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getGenresForAdmin } from "@/services/genre.services";
import { IGenre } from "@/types/genre.types";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { genresColumns } from "./genresColumns";
import CreateGenreModal from "./CreateGenreModal";
import EditGenreModal from "./EditGenreModal";
import DeleteGenreDialog from "./DeleteGenreDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const GenresTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();

	const {
		editingItem,
		deletingItem,
		isEditModalOpen,
		isDeleteDialogOpen,
		onEditOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<IGenre>({ enableView: false });

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

	const queryString = queryStringFromUrl || initialQueryString;

	const { searchTermFromUrl, handleDebouncedSearchChange } = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	});

	const {
		data: genresResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["genres", queryString],
		queryFn: () => getGenresForAdmin(queryString),
	});

	const genres: IGenre[] = genresResponse?.data ?? [];
	const meta: PaginationMeta | undefined = genresResponse?.meta;

	return (
		<>
			<DataTable
				data={genres}
				columns={genresColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No genres found."
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
					placeholder: "Search by name...",
					debounceMs: 500,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				toolbarAction={<CreateGenreModal />}
				meta={meta}
				actions={tableActions}
			/>

			<EditGenreModal open={isEditModalOpen} onOpenChange={onEditOpenChange} genre={editingItem} />

			<DeleteGenreDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange} genre={deletingItem} />
		</>
	);
};

export default GenresTable;
