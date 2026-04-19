import ActiveFiltersBar from "@/components/modules/Movies/ActiveFiltersBar";
import MovieCard from "@/components/modules/Movies/MovieCard";
import MoviesFilter from "@/components/modules/Movies/MoviesFilter";
import MoviesHero from "@/components/modules/Movies/MoviesHero";
import { getMovieFilters, getMovies } from "@/services/movie.services";
import { Suspense } from "react";

interface MoviesPageProps {
	searchParams: Promise<Record<string, string>>;
}

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
	const params = await searchParams;
	const queryString = new URLSearchParams(params).toString();

	const [moviesRes, filters] = await Promise.all([getMovies(queryString || "limit=12"), getMovieFilters()]);

	const movies = moviesRes?.data ?? [];
	const total = moviesRes?.meta?.total ?? 0;

	return (
		<>
			<Suspense>
				<MoviesHero total={total} />
			</Suspense>

			<div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-10">
				<div className="grid grid-cols-[240px_minmax(0,1fr)] gap-10 items-start">
					{/* Sidebar */}
					<div className="sticky top-[80px]">
						<Suspense>
							<MoviesFilter
								genres={filters.genres}
								platforms={filters.platforms}
								availableYears={filters.availableYears}
							/>
						</Suspense>
					</div>

					{/* Main */}
					<div className="min-w-0">
						<Suspense>
							<ActiveFiltersBar genres={filters.genres} platforms={filters.platforms} />
						</Suspense>

						{movies.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-32 text-center border border-line-2 rounded-[14px] bg-bg-2">
								<p className="text-[18px] font-bold text-ink mb-2">No movies found</p>
								<p className="text-sm text-text-muted">Try adjusting your filters or search term.</p>
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-[22px]">
								{movies.map((movie, index) => (
									<MovieCard key={movie.id} movie={movie} index={index} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default MoviesPage;
