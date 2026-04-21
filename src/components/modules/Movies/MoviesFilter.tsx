"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { IGenre, IPlatform } from "@/types/movie.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sortOptions = [
	{ label: "Highest Rated", sortBy: "averageRating", sortOrder: "desc" },
	{ label: "Most Reviewed", sortBy: "totalReviews", sortOrder: "desc" },
	{ label: "Latest Releases", sortBy: "releaseYear", sortOrder: "desc" },
	{ label: "Newest Added", sortBy: "createdAt", sortOrder: "desc" },
];

const ratingOptions = [
	{ label: "9+ Stars", value: "9", filled: 5 },
	{ label: "7+ Stars", value: "7", filled: 4 },
	{ label: "5+ Stars", value: "5", filled: 3 },
];

interface MoviesFilterProps {
	genres: IGenre[];
	platforms: IPlatform[];
	availableYears: number[];
}

const MoviesFilter = ({ genres, platforms, availableYears }: MoviesFilterProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentSortBy = searchParams.get("sortBy") ?? "";
	const currentSortOrder = searchParams.get("sortOrder") ?? "";
	const currentGenre = searchParams.get("genreId") ?? "";
	const currentPlatform = searchParams.get("platformId") ?? "";
	const currentRating = searchParams.get("minRating") ?? "";

	const push = (params: URLSearchParams) => {
		params.delete("page");
		router.push(`/movies?${params.toString()}`);
	};

	const toggleParam = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.get(key) === value ? params.delete(key) : params.set(key, value);
		push(params);
	};

	const setSort = (sortBy: string, sortOrder: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (currentSortBy === sortBy && currentSortOrder === sortOrder) {
			params.delete("sortBy");
			params.delete("sortOrder");
		} else {
			params.set("sortBy", sortBy);
			params.set("sortOrder", sortOrder);
		}
		push(params);
	};

	const setRating = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		currentRating === value ? params.delete("minRating") : params.set("minRating", value);
		push(params);
	};
	const minYear = availableYears.length > 0 ? Math.min(...availableYears) : 2000;
	const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : new Date().getFullYear();

	const currentYearFrom = parseInt(searchParams.get("releaseYearFrom") ?? String(minYear));
	const currentYearTo = parseInt(searchParams.get("releaseYearTo") ?? String(maxYear));

	const [yearRange, setYearRange] = useState<[number, number]>([currentYearFrom, currentYearTo]);

	const handleYearChange = (values: number[]) => {
		setYearRange(values);
	};

	const handleYearCommit = (values: number[]) => {
		const params = new URLSearchParams(searchParams.toString());
		if (values[0] === minYear && values[1] === maxYear) {
			params.delete("releaseYearFrom");
			params.delete("releaseYearTo");
		} else {
			params.set("releaseYearFrom", String(values[0]));
			params.set("releaseYearTo", String(values[1]));
		}
		push(params);
	};

	return (
		<aside className="flex-3 shrink-0 pr-2">
			<div className="mb-9">
				<p className="text-[11px] font-bold text-ink tracking-[0.12em] uppercase mb-3.5">Sort By</p>
				<div className="space-y-0.5">
					{sortOptions.map((opt) => {
						const isActive = currentSortBy === opt.sortBy && currentSortOrder === opt.sortOrder;
						return (
							<div
								key={opt.label}
								onClick={() => setSort(opt.sortBy, opt.sortOrder)}
								className={cn(
									"flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-sm cursor-pointer transition-colors select-none",
									isActive ? "bg-brand-soft text-brand font-semibold" : "text-text-base hover:bg-line-2",
								)}
							>
								<span
									className={cn(
										"w-3.5 h-3.5 rounded-full border-2 shrink-0",
										isActive
											? "border-brand [background:radial-gradient(circle,#EF4C5C_40%,transparent_42%)]"
											: "border-line",
									)}
								/>
								{opt.label}
							</div>
						);
					})}
				</div>
			</div>

			{genres.length > 0 && (
				<div className="mb-9">
					<p className="text-[11px] font-bold text-ink tracking-[0.12em] uppercase mb-3.5">Genre</p>
					<div className="flex flex-wrap gap-2">
						{genres.map((genre) => (
							<button
								key={genre.id}
								onClick={() => toggleParam("genreId", genre.id)}
								className={cn(
									"text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-all",
									currentGenre === genre.id
										? "bg-brand text-white border-brand"
										: "bg-white border-line text-text-base hover:border-brand hover:text-brand",
								)}
							>
								{genre.name}
							</button>
						))}
					</div>
				</div>
			)}

			{availableYears.length > 0 && (
				<div className="mb-9">
					<p className="text-[11px] font-bold text-ink tracking-[0.12em] uppercase mb-3.5">Release Year</p>
					<div className="flex items-center justify-between mb-3">
						<span className="text-[15px] font-bold text-ink">{yearRange[0]}</span>
						<span className="text-[15px] font-bold text-ink">{yearRange[1]}</span>
					</div>
					<Slider
						min={minYear}
						max={maxYear}
						step={1}
						value={yearRange}
						onValueChange={handleYearChange}
						onValueCommit={handleYearCommit}
						className="mb-2"
					/>
					<div className="flex items-center justify-between mt-1">
						<span className="text-[11px] text-text-subtle">{minYear}</span>
						<span className="text-[11px] text-text-subtle">{maxYear}</span>
					</div>
				</div>
			)}

			<div className="mb-9">
				<p className="text-[11px] font-bold text-ink tracking-[0.12em] uppercase mb-3.5">Rating Range</p>
				<div className="space-y-0.5">
					{ratingOptions.map((opt) => {
						const isActive = currentRating === opt.value;
						return (
							<div
								key={opt.label}
								onClick={() => setRating(opt.value)}
								className={cn(
									"flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] cursor-pointer transition-colors select-none",
									isActive ? "bg-brand-soft text-brand font-semibold" : "text-text-base hover:bg-line-2",
								)}
							>
								<span
									className={cn(
										"w-3.5 h-3.5 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 text-[9px] font-bold",
										isActive ? "border-brand bg-brand text-white" : "border-line",
									)}
								>
									{isActive && "✓"}
								</span>
								<span className="flex items-center gap-1">
									<span className="text-yellow text-[11px] tracking-[-1px]">
										{"★".repeat(opt.filled)}
										<span className="opacity-20">{"★".repeat(5 - opt.filled)}</span>
									</span>
									{opt.label}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{platforms.length > 0 && (
				<div className="mb-9">
					<p className="text-[11px] font-bold text-ink tracking-[0.12em] uppercase mb-3.5">Platform</p>
					<div className="space-y-0.5">
						{platforms.map((platform) => {
							const isActive = currentPlatform === platform.id;
							return (
								<div
									key={platform.id}
									onClick={() => toggleParam("platformId", platform.id)}
									className={cn(
										"flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] cursor-pointer transition-colors select-none",
										isActive ? "bg-brand-soft text-brand font-semibold" : "text-text-base hover:bg-line-2",
									)}
								>
									<span className={cn("w-2 h-2 rounded-full shrink-0", isActive ? "bg-brand" : "bg-text-subtle")} />
									{platform.name}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</aside>
	);
};

export default MoviesFilter;
