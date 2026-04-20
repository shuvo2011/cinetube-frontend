import { Suspense } from "react";
import MoviesTable from "@/components/modules/AdminMovies/MoviesTable";

export default async function MoviesPage({ searchParams }: { searchParams: Record<string, string> }) {
	const initialQueryString = new URLSearchParams(searchParams).toString();

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">Movies & Series</h2>
				<p className="text-muted-foreground mt-1 text-sm">Manage all movies and series in the media library.</p>
			</div>
			<Suspense>
				<MoviesTable initialQueryString={initialQueryString} />
			</Suspense>
		</div>
	);
}
