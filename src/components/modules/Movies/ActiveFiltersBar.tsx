"use client";

import { IGenre } from "@/services/genre.services";
import { IPlatform } from "@/services/platform.services";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ActiveFiltersBarProps {
	genres: IGenre[];
	platforms: IPlatform[];
}

const ActiveFiltersBar = ({ genres, platforms }: ActiveFiltersBarProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const genreId = searchParams.get("genreId");
	const platformId = searchParams.get("platformId");
	const minRating = searchParams.get("minRating");
	const searchTerm = searchParams.get("searchTerm");
	const releaseYear = searchParams.get("releaseYear");

	const activeFilters = [
		genreId && { label: genres.find((g) => g.id === genreId)?.name ?? "Genre", key: "genreId" },
		platformId && { label: platforms.find((p) => p.id === platformId)?.name ?? "Platform", key: "platformId" },
		minRating && { label: `${minRating}+ Stars`, key: "minRating" },
		searchTerm && { label: `"${searchTerm}"`, key: "searchTerm" },
		releaseYear && { label: releaseYear, key: "releaseYear" },
	].filter(Boolean) as { label: string; key: string }[];

	if (activeFilters.length === 0) return null;

	const removeFilter = (key: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete(key);
		params.delete("page");
		router.push(`/movies?${params.toString()}`);
	};

	return (
		<div className="flex items-center gap-2.5 flex-wrap mb-6 pb-5 border-b border-line-2">
			<span className="text-[13px] text-text-muted">Active filters:</span>
			{activeFilters.map((filter) => (
				<span
					key={filter.key}
					className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-brand-softer text-brand px-2.5 py-1 rounded-full"
				>
					{filter.label}
					<button onClick={() => removeFilter(filter.key)} className="opacity-60 hover:opacity-100 transition-opacity">
						<X size={11} />
					</button>
				</span>
			))}
			<button
				onClick={() => router.push("/movies")}
				className="text-[13px] text-text-muted hover:text-brand transition-colors"
			>
				Clear all
			</button>
		</div>
	);
};

export default ActiveFiltersBar;
