"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getReviewsForAdmin, IAdminReview, updateReviewStatusAction } from "@/services/review.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { adminReviewColumns } from "./adminReviewColumns";
import AdminReviewViewDialog from "./AdminReviewViewDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminReviewsTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const [selectedReview, setSelectedReview] = useState<IAdminReview | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

	const {
		queryStringFromUrl,
		optimisticSortingState,
		optimisticPaginationState,
		isRouteRefreshPending,
		updateParams,
		handleSortingChange,
		handlePaginationChange,
	} = useServerManagedDataTable({ searchParams, defaultPage: DEFAULT_PAGE, defaultLimit: DEFAULT_LIMIT });

	const { searchTermFromUrl, handleDebouncedSearchChange } = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	});

	const queryString = queryStringFromUrl || initialQueryString;

	const {
		data: reviewsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["admin-reviews", queryString],
		queryFn: () => getReviewsForAdmin(queryString),
	});

	const reviews: IAdminReview[] = reviewsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = reviewsResponse?.meta;

	const handleStatusChange = async (id: string, newStatus: string) => {
		const res = await updateReviewStatusAction(id, newStatus);
		if (!res?.success) return;

		queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
	};

	const columns = useMemo(
		() =>
			adminReviewColumns({
				onView: (r) => {
					setSelectedReview(r);
					setIsViewOpen(true);
				},
				onApprove: (r) => handleStatusChange(r.id, "PUBLISHED"),
				onUnpublish: (r) => handleStatusChange(r.id, "UNPUBLISHED"),
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<>
			<DataTable
				data={reviews}
				columns={columns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No reviews found."
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

			<AdminReviewViewDialog
				open={isViewOpen}
				onOpenChange={(open) => {
					setIsViewOpen(open);
					if (!open) setSelectedReview(null);
				}}
				review={selectedReview}
			/>
		</>
	);
};

export default AdminReviewsTable;
