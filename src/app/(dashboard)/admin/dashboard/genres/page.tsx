import { Suspense } from "react";
import GenresTable from "@/components/modules/Genres/GenresTable";

export const metadata = {
	title: "Genres - Manage Genres | CineTube Admin",
	description:
		"Manage movie and TV series genres. Add, edit, or delete genre categories. Organize content by action, drama, comedy, horror, and more on CineTube.",
};

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
