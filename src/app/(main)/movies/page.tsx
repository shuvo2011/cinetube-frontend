import MoviesLayout from "@/components/modules/Movies/MoviesLayout";
import MovieCard from "@/components/modules/Movies/MovieCard";
import MoviesHero from "@/components/modules/Movies/MoviesHero";
import { getMovieFilters, getMovies } from "@/services/movie.services";
import { Suspense } from "react";
import MoviesPagination from "@/components/modules/Movies/MoviesPagination";

interface MoviesPageProps {
	searchParams: Promise<Record<string, string>>;
}

const MoviesPage = async ({ searchParams }: MoviesPageProps) => {
	const params = await searchParams;
	const page = params.page ?? "1";
	const queryString = new URLSearchParams({ ...params, limit: "12" }).toString();

	const [moviesRes, filters] = await Promise.all([getMovies(queryString), getMovieFilters()]);

	const movies = moviesRes?.data ?? [];
	const total = moviesRes?.meta?.total ?? 0;

	return (
		<>
			<Suspense>
				<MoviesHero key={params.searchTerm ?? params.search ?? ""} total={total} />
			</Suspense>

			<MoviesLayout
				genres={filters.genres}
				platforms={filters.platforms}
				availableYears={filters.availableYears}
				total={total}
			>
				{movies.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-32 text-center border border-line-2 rounded-[14px] bg-bg-2">
						<p className="text-[18px] font-bold text-ink mb-2">No movies found</p>
						<p className="text-sm text-text-muted">Try adjusting your filters or search term.</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-[22px]">
							{movies.map((movie, index) => (
								<MovieCard key={movie.id} movie={movie} index={index} />
							))}
						</div>
						{moviesRes?.meta && moviesRes.meta.totalPages > 1 && (
							<Suspense>
								<MoviesPagination meta={moviesRes.meta} />
							</Suspense>
						)}
					</>
				)}
			</MoviesLayout>
		</>
	);
};

export default MoviesPage;
