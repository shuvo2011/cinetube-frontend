import { IMovie } from "@/types/movie.types";

interface Props {
	movie: IMovie;
}
const format = (num: number) => num.toLocaleString();
const MovieStats = ({ movie }: Props) => (
	<div className="bg-white rounded-[14px] border border-line-2 p-5">
		<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Stats</p>

		<div className="grid grid-cols-2 gap-3">
			{[
				{
					n: movie.averageRating !== null && movie.averageRating !== undefined ? movie.averageRating.toFixed(1) : "N/A",
					l: "Avg Rating",
				},
				{ n: format(movie.totalReviews ?? 0), l: "Reviews" },
				{ n: format(movie.totalWatchlists ?? 0), l: "Watchlists" },
				{ n: format(movie.totalComments ?? 0), l: "Comments" },
			].map(({ n, l }) => (
				<div key={l} className="bg-bg-2 rounded-[10px] p-3 text-center">
					<div className="text-[20px] font-black text-ink">{n}</div>
					<div className="text-[11px] text-text-muted mt-0.5">{l}</div>
				</div>
			))}
		</div>
	</div>
);

export default MovieStats;
