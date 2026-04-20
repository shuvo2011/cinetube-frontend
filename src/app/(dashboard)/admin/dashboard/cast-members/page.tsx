import { Suspense } from "react";
import CastMembersTable from "@/components/modules/CastMembers/CastMembersTable";

export default function CastMembersPage({ searchParams }: { searchParams: Record<string, string> }) {
	const initialQueryString = new URLSearchParams(searchParams).toString();

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">Cast Members</h2>
				<p className="text-muted-foreground mt-1 text-sm">Manage all cast members in the media library.</p>
			</div>

			<Suspense>
				<CastMembersTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
