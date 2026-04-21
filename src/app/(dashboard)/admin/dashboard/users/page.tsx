import { Suspense } from "react";
import AdminUsersTable from "@/components/modules/AdminUsers/AdminUsersTable";
export const metadata = {
	title: "Users - Manage User Accounts | CineTube Admin",
	description:
		"Manage all user accounts on CineTube. View, edit, suspend, or delete users. Track user activity, ratings, reviews, and subscription status.",
};
export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
	const resolvedParams = await searchParams;
	const initialQueryString = new URLSearchParams(resolvedParams).toString();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">Users</h1>
				<p className="text-[13px] text-text-muted mt-0.5">Manage all registered users</p>
			</div>
			<Suspense>
				<AdminUsersTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
