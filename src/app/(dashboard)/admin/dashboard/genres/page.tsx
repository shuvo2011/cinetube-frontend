import { Suspense } from "react";
import GenresTable from "@/components/modules/Genres/GenresTable";

export default async function GenresPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
	const resolvedParams = await searchParams;
	const initialQueryString = new URLSearchParams(resolvedParams).toString();

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">Genres</h2>
				<p className="text-muted-foreground mt-1 text-sm">Manage all genres in the media library.</p>
			</div>
			<Suspense>
				<GenresTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
