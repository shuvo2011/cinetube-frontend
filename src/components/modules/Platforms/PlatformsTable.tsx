"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getPlatforms } from "@/services/platform.services";
import { IPlatform } from "@/types/platform.types";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
// import { platformsColumns } from "./platformsColumns";
// import CreatePlatformModal from "./CreatePlatformModal";
import EditPlatformModal from "./EditPlatformModal";
import DeletePlatformDialog from "./DeletePlatformDialog";
import { platformsColumns } from "./PlatformsColumns";
import CreatePlatformModal from "./CreatePlatformModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PlatformsTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();

	const {
		editingItem,
		deletingItem,
		isEditModalOpen,
		isDeleteDialogOpen,
		onEditOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<IPlatform>({ enableView: false });

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
		data: platformsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["platforms", queryString],
		queryFn: () => getPlatforms(queryString),
	});

	const platforms: IPlatform[] = platformsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = platformsResponse?.meta;

	return (
		<>
			<DataTable
				data={platforms}
				columns={platformsColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No platforms found."
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
				toolbarAction={<CreatePlatformModal />}
				meta={meta}
				actions={tableActions}
			/>

			<EditPlatformModal open={isEditModalOpen} onOpenChange={onEditOpenChange} platform={editingItem} />

			<DeletePlatformDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange} platform={deletingItem} />
		</>
	);
};

export default PlatformsTable;
