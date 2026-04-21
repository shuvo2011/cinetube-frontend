// src/components/modules/Home/NewReleasesSection.tsx
import { IMovie } from "@/types/movie.types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CARD_COLORS = [
	{ bg: "#FCE3E6", dot: "#F3B0B8" },
	{ bg: "#FDF1D5", dot: "#F2C76C" },
	{ bg: "#DDF4E5", dot: "#7FCFA2" },
	{ bg: "#E2E1FB", dot: "#A8A4F0" },
	{ bg: "#DBEAFE", dot: "#93C5FD" },
	{ bg: "#FEF3C7", dot: "#FCD34D" },
];

interface NewReleasesSectionProps {
	movies: IMovie[];
}

const NewReleasesSection = ({ movies }: NewReleasesSectionProps) => {
	console.log("Rendering NewReleasesSection with movies:", movies);
	return (
		<section className="py-16 md:py-20 bg-bg-2">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				{/* Header */}
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase mb-3">Just Added</p>
						<h2 className="text-[36px] md:text-[42px] font-black tracking-tight text-ink leading-[1.05]">
							New Releases
						</h2>
					</div>
					<Link
						href="/movies"
						className="text-sm font-semibold text-ink border border-line bg-bg hover:bg-line-2 transition-colors px-4 py-2 rounded-[10px]"
					>
						View all →
					</Link>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
					{movies.map((movie, index) => {
						const color = CARD_COLORS[index % CARD_COLORS.length];
						const isFree = movie.pricingType === "FREE";

						return (
							<Link
								key={movie.id}
								href={`/movies/${movie.id}`}
								className="bg-bg rounded-[14px] overflow-hidden border border-line-2 hover:-translate-y-1 transition-transform"
							>
								{/* Thumbnail */}
								<div className="aspect-4/5 relative flex items-center justify-center" style={{ background: color.bg }}>
									{movie.posterImage ? (
										<div className="relative w-90 h-100">
											<Image
												src={movie.posterImage}
												alt={movie.title}
												fill
												sizes="(max-width: 768px) 50vw, 25vw"
												className="object-cover"
											/>
										</div>
									) : (
										<div className="w-30 h-30 rounded-full" style={{ background: color.dot }} />
									)}

									{/* Badge */}
									<span
										className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
											isFree ? "bg-green-soft text-green" : "bg-brand-softer text-brand"
										}`}
									>
										{isFree ? "Free" : "Premium"}
									</span>
								</div>

								{/* Body */}
								<div className="p-4">
									<div className="text-[16px] font-bold text-ink mb-1 truncate">{movie.title}</div>
									<div className="text-xs text-text-muted mb-2.5">
										{movie.genres
											?.slice(0, 2)
											.map((g) => g.genre.name)
											.join(" · ")}
										{movie.releaseYear && ` · ${movie.releaseYear}`}
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-1">
											<Star size={13} className="text-yellow fill-yellow" />
											<span className="text-sm font-bold text-ink">
												{movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}
											</span>
										</div>
										<span className="text-[11px] text-text-muted">{movie.platforms?.[0]?.platform?.name ?? ""}</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default NewReleasesSection;
