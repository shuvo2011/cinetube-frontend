"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { deleteCommentAction, getCommentsForAdmin, IAdminComment } from "@/services/comment.services";
import { PaginationMeta } from "@/types/api.types";
import { adminCommentColumns } from "./adminCommentColumns";
import AdminCommentViewDialog from "./AdminCommentViewDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminCommentsTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const [selectedComment, setSelectedComment] = useState<IAdminComment | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

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

	const {
		data: commentsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["admin-comments", queryString],
		queryFn: () => getCommentsForAdmin(queryString),
	});

	const comments: IAdminComment[] = commentsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = commentsResponse?.meta;

	const handleDelete = async (comment: IAdminComment) => {
		if (!confirm(`Delete this comment by "${comment.user.name}"?`)) return;

		const res = await deleteCommentAction(comment.id);
		if (!res?.success) return;

		queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
	};

	const handleView = (comment: IAdminComment) => {
		setSelectedComment(comment);
		setIsViewOpen(true);
	};

	const columns = useMemo(
		() =>
			adminCommentColumns({
				onDelete: handleDelete,
				onView: handleView,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<>
			<DataTable
				data={comments}
				columns={columns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No comments found."
				sorting={{ state: optimisticSortingState, onSortingChange: handleSortingChange }}
				pagination={{ state: optimisticPaginationState, onPaginationChange: handlePaginationChange }}
				search={{
					initialValue: searchTermFromUrl,
					placeholder: "Search by content...",
					debounceMs: 500,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				meta={meta}
			/>

			<AdminCommentViewDialog
				open={isViewOpen}
				onOpenChange={(open) => {
					setIsViewOpen(open);
					if (!open) setSelectedComment(null);
				}}
				comment={selectedComment}
			/>
		</>
	);
};

export default AdminCommentsTable;
