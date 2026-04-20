"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getTagsForAdmin } from "@/services/tag.services";
import { ITag } from "@/types/tag.types";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { tagsColumns } from "./tagsColumns";
import CreateTagModal from "./CreateTagModal";
import EditTagModal from "./EditTagModal";
import DeleteTagDialog from "./DeleteTagDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const TagsTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();

	const {
		editingItem,
		deletingItem,
		isEditModalOpen,
		isDeleteDialogOpen,
		onEditOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<ITag>({ enableView: false });

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
		data: tagsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["tags", queryString],
		queryFn: () => getTagsForAdmin(queryString),
	});

	const tags: ITag[] = tagsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = tagsResponse?.meta;

	return (
		<>
			<DataTable
				data={tags}
				columns={tagsColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No tags found."
				sorting={{ state: optimisticSortingState, onSortingChange: handleSortingChange }}
				pagination={{ state: optimisticPaginationState, onPaginationChange: handlePaginationChange }}
				search={{
					initialValue: searchTermFromUrl,
					placeholder: "Search by name...",
					debounceMs: 500,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				toolbarAction={<CreateTagModal />}
				meta={meta}
				actions={tableActions}
			/>
			<EditTagModal open={isEditModalOpen} onOpenChange={onEditOpenChange} tag={editingItem} />
			<DeleteTagDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange} tag={deletingItem} />
		</>
	);
};

export default TagsTable;
