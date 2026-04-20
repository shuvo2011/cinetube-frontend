import { Suspense } from "react";
import TagsTable from "@/components/modules/Tags/TagsTable";

export default function TagsPage({ searchParams }: { searchParams: Record<string, string> }) {
	const initialQueryString = new URLSearchParams(searchParams).toString();

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">Tags</h2>
				<p className="text-muted-foreground mt-1 text-sm">Manage all tags in the media library.</p>
			</div>
			<Suspense>
				<TagsTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
