"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import MoviesFilter from "./MoviesFilter";
import ActiveFiltersBar from "./ActiveFiltersBar";
import { IGenre } from "@/types/genre.types";
import { IPlatform } from "@/types/platform.types";

interface MoviesLayoutProps {
	genres: IGenre[];
	platforms: IPlatform[];
	availableYears: number[];
	children: React.ReactNode;
	total: number;
}

const MoviesLayout = ({ genres, platforms, availableYears, children }: MoviesLayoutProps) => {
	const [filterOpen, setFilterOpen] = useState(false);

	return (
		<div className="w-full max-w-350 mx-auto px-6 md:px-10 py-10">
			<div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-10 items-start">
				<div className="sticky top-20 self-start hidden lg:block">
					<MoviesFilter genres={genres} platforms={platforms} availableYears={availableYears} />
				</div>

				<div className="min-w-0">
					<div className="flex items-center justify-between mb-4 lg:hidden">
						<button
							onClick={() => setFilterOpen(true)}
							className="flex items-center gap-2 text-sm font-semibold border border-line rounded-[10px] px-4 py-2"
						>
							<Filter size={15} />
							Filters
						</button>
					</div>

					<ActiveFiltersBar genres={genres} platforms={platforms} />

					{children}
				</div>
			</div>

			{filterOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />

					<div className="absolute left-0 top-0 h-full w-75 bg-white overflow-y-auto p-6">
						<div className="flex items-center justify-between mb-6">
							<p className="font-bold text-ink text-[16px]">Filters</p>
							<button onClick={() => setFilterOpen(false)}>
								<X size={20} />
							</button>
						</div>
						<MoviesFilter genres={genres} platforms={platforms} availableYears={availableYears} />
					</div>
				</div>
			)}
		</div>
	);
};

export default MoviesLayout;
