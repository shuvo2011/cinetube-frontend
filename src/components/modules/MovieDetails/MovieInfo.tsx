import { IMovie } from "@/types/movie.types";

interface Props {
	movie: IMovie;
}

const MovieInfo = ({ movie }: Props) => (
	<div className="bg-white rounded-[14px] border border-line-2 p-5">
		<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Movie Info</p>
		<div className="space-y-3">
			{[
				{ k: "Director", v: movie.director },
				{ k: "Release Year", v: movie.releaseYear },
				{ k: "Genre", v: movie.genres?.map((g) => g.genre.name).join(", ") },
				{ k: "Platform", v: movie.platforms?.map((p) => p.platform.name).join(", ") },
				{ k: "Pricing", v: movie.pricingType === "FREE" ? "Free" : "Premium" },
			].map(({ k, v }) =>
				v ? (
					<div key={k} className="flex items-start justify-between gap-4 text-[13px]">
						<span className="text-text-muted shrink-0">{k}</span>
						<span className="text-ink font-medium text-right">{v}</span>
					</div>
				) : null,
			)}
		</div>
	</div>
);

export default MovieInfo;
