"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getCastMembers } from "@/services/castMember.services";
import { ICastMember } from "@/types/castMember.types";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { castMembersColumns } from "./castMembersColumns";
import CreateCastMemberModal from "./CreateCastMemberModal";
import EditCastMemberModal from "./EditCastMemberModal";
import DeleteCastMemberDialog from "./DeleteCastMemberDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const CastMembersTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();

	const {
		editingItem,
		deletingItem,
		isEditModalOpen,
		isDeleteDialogOpen,
		onEditOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<ICastMember>({ enableView: false });

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
		data: castMembersResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["cast-members", queryString],
		queryFn: () => getCastMembers(queryString),
	});

	const castMembers: ICastMember[] = castMembersResponse?.data ?? [];
	const meta: PaginationMeta | undefined = castMembersResponse?.meta;

	return (
		<>
			<DataTable
				data={castMembers}
				columns={castMembersColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No cast members found."
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
				toolbarAction={<CreateCastMemberModal />}
				meta={meta}
				actions={tableActions}
			/>

			<EditCastMemberModal open={isEditModalOpen} onOpenChange={onEditOpenChange} castMember={editingItem} />

			<DeleteCastMemberDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange} castMember={deletingItem} />
		</>
	);
};

export default CastMembersTable;
