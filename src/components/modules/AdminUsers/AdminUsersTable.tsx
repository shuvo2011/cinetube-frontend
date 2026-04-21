"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllUsers, changeUserStatus, changeUserRole, IAdminUser } from "@/services/user.services";
import { getMyProfile } from "@/services/user.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { adminUserColumns } from "./adminUserColumns";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminUsersTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

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
		data: usersResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["admin-users", queryString],
		queryFn: () => getAllUsers(queryString),
	});

	const { data: profileRes } = useQuery({ queryKey: ["me"], queryFn: getMyProfile });
	const currentRole: string = profileRes?.data?.role ?? "ADMIN";

	const users: IAdminUser[] = usersResponse?.data ?? [];
	const meta: PaginationMeta | undefined = usersResponse?.meta;

	const handleStatusChange = async (user: IAdminUser, status: string) => {
		try {
			await changeUserStatus(user.id, status);
			toast.success(`${user.name} marked as ${status.toLowerCase()}`);
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (err: any) {
			toast.error(err?.message ?? "Failed to change status");
		}
	};

	const handleRoleChange = async (user: IAdminUser, role: string) => {
		if (!confirm(`Change ${user.name}'s role to ${role}?`)) return;
		try {
			await changeUserRole(user.id, role);
			toast.success(`${user.name}'s role changed to ${role}`);
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (err: any) {
			toast.error(err?.message ?? "Failed to change role");
		}
	};

	const currentUserId: string = profileRes?.data?.id ?? "";

	const handleDelete = async (user: IAdminUser) => {
		if (user.id === currentUserId) {
			toast.warning("You cannot delete your own account.");
			return;
		}
		if (!confirm(`Soft delete "${user.name}"? They will be marked as deleted.`)) return;
		try {
			const res = await fetch(`${API_BASE}/users/${user.id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				toast.error(data?.message ?? "Failed to delete user");
				return;
			}
			toast.success(`${user.name} soft deleted`);
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		} catch {
			toast.error("Failed to delete user");
		}
	};

	const handleHardDelete = async (user: IAdminUser) => {
		if (user.id === currentUserId) {
			toast.warning("You cannot delete your own account.");
			return;
		}
		if (!confirm(`PERMANENTLY delete "${user.name}"? This cannot be undone.`)) return;
		try {
			const res = await fetch(`${API_BASE}/users/${user.id}/hard`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				toast.error(data?.message ?? "Failed to hard delete user");
				return;
			}
			toast.success(`${user.name} permanently deleted`);
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		} catch {
			toast.error("Failed to hard delete user");
		}
	};

	const columns = useMemo(
		() =>
			adminUserColumns({
				currentRole,
				onStatusChange: handleStatusChange,
				onRoleChange: handleRoleChange,
				onDelete: handleDelete,
				onHardDelete: handleHardDelete,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentRole],
	);

	return (
		<DataTable
			data={users}
			columns={columns}
			isLoading={isLoading || isFetching || isRouteRefreshPending}
			emptyMessage="No users found."
			sorting={{ state: optimisticSortingState, onSortingChange: handleSortingChange }}
			pagination={{ state: optimisticPaginationState, onPaginationChange: handlePaginationChange }}
			search={{
				initialValue: searchTermFromUrl,
				placeholder: "Search by name or email...",
				debounceMs: 500,
				onDebouncedChange: handleDebouncedSearchChange,
			}}
			meta={meta}
		/>
	);
};

export default AdminUsersTable;
