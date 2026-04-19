import { IMovie } from "@/types/movie.types";
import Link from "next/link";

interface TopRatedSectionProps {
	movies: IMovie[];
}

const TopRatedSection = ({ movies }: TopRatedSectionProps) => {
	return (
		<section className="py-16 md:py-20 bg-bg">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
					<div>
						<p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase mb-3">This Week</p>
						<h2 className="text-[36px] md:text-[42px] font-black tracking-tight text-ink leading-[1.05]">Top Rated</h2>
					</div>
					<p className="text-[15px] text-text-muted max-w-sm md:text-right leading-relaxed">
						Our community of 200K+ cinephiles rates and reviews every title.
					</p>
				</div>

				{/* List */}
				<div className="flex flex-col">
					{movies.map((movie, index) => (
						<Link
							key={movie.id}
							href={`/movies/${movie.id}`}
							className="grid grid-cols-[60px_1fr_auto] gap-5 items-center px-6 py-5 bg-bg border border-line-2 rounded-[14px] mb-2 hover:border-line transition-colors"
						>
							{/* Number */}
							<span className="text-[32px] font-black text-brand leading-none tracking-[-0.03em]">{index + 1}</span>

							{/* Info */}
							<div>
								<div className="text-[18px] font-bold text-ink mb-1">{movie.title}</div>
								<div className="text-[13px] text-text-muted">
									{[
										movie.genres
											?.slice(0, 2)
											.map((g) => g.genre.name)
											.join(" · "),
										movie.director,
									]
										.filter(Boolean)
										.join(" · ")}
								</div>
							</div>

							{/* Score */}
							<div className="text-right shrink-0">
								<span className="text-[22px] font-black text-ink tracking-[-0.02em]">
									{movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}
								</span>
								<span className="text-[13px] text-text-subtle font-medium">/10</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default TopRatedSection;
