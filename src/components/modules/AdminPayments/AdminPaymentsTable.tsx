"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllPayments, IAdminPayment } from "@/services/payment.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { adminPaymentColumns } from "./adminPaymentColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminPaymentsTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();

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
		data: paymentsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["admin-payments", queryString],
		queryFn: () => getAllPayments(queryString),
	});

	const payments: IAdminPayment[] = paymentsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = paymentsResponse?.meta;

	return (
		<DataTable
			data={payments}
			columns={adminPaymentColumns}
			isLoading={isLoading || isFetching || isRouteRefreshPending}
			emptyMessage="No payments found."
			sorting={{ state: optimisticSortingState, onSortingChange: handleSortingChange }}
			pagination={{ state: optimisticPaginationState, onPaginationChange: handlePaginationChange }}
			search={{
				initialValue: searchTermFromUrl,
				placeholder: "Search payments...",
				debounceMs: 500,
				onDebouncedChange: handleDebouncedSearchChange,
			}}
			meta={meta}
		/>
	);
};

export default AdminPaymentsTable;
