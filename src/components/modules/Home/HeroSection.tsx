// src/components/modules/Home/HeroSection.tsx
import { IMovie } from "@/types/movie.types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CARD_COLORS = [
	{ bg: "#FCE3E6", dot: "#F3B0B8" },
	{ bg: "#FDF1D5", dot: "#F2C76C" },
	{ bg: "#DDF4E5", dot: "#7FCFA2" },
];

const stats = [
	{ value: "12K+", label: "Movies & Series" },
	{ value: "85K+", label: "Community Reviews" },
	{ value: "4.8★", label: "Average Rating" },
	{ value: "200K+", label: "Active Members" },
];

interface HeroSectionProps {
	movies: IMovie[];
}

const HeroSection = ({ movies }: HeroSectionProps) => {
	return (
		<section className="bg-cream py-16 md:py-20 overflow-hidden">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left */}
					<div>
						{/* Eyebrow */}
						<div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-medium text-text-base shadow-sm mb-5">
							<span className="w-1.5 h-1.5 rounded-full bg-brand" />
							New releases every week
						</div>

						{/* Heading */}
						<h1 className="text-[52px] md:text-[64px] font-black tracking-[-0.035em] text-ink leading-[1.02] mb-6">
							Rate, Review &amp;
							<br />
							Stream your
							<br />
							Favorite <em className="not-italic text-brand">Films</em>
						</h1>

						{/* Description */}
						<p className="text-[17px] text-text-muted max-w-[520px] mb-8 leading-relaxed">
							Discover thousands of movies and series. Read community reviews, write your own, and stream premium
							content — all in one place.
						</p>

						{/* Actions */}
						<div className="flex items-center gap-3 mb-12">
							<Link
								href="/movies"
								className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold text-sm px-6 py-3 rounded-[10px] transition-colors"
							>
								Explore Now →
							</Link>
							<Link
								href="#how-it-works"
								className="inline-flex items-center gap-2 bg-white hover:bg-line-2 text-ink font-semibold text-sm px-6 py-3 rounded-[10px] border border-line transition-colors"
							>
								How it works
							</Link>
						</div>

						{/* Stats */}
						<div className="flex items-center gap-8 flex-wrap">
							{stats.map((stat) => (
								<div key={stat.label}>
									<div className="text-[22px] font-black text-ink tracking-tight">{stat.value}</div>
									<div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
								</div>
							))}
						</div>
					</div>

					{/* Right — Movie Cards */}
					<div className="relative h-95 hidden lg:block">
						{movies.slice(0, 3).map((movie, index) => {
							const color = CARD_COLORS[index];
							const positions = [
								"top-[20px] left-[40px] rotate-[-6deg] z-10",
								"bottom-[20px] left-[160px] rotate-[0deg] z-30",
								"top-[60px] right-[0px] rotate-[4deg] z-20",
							];

							return (
								<Link
									href={`/movies/${movie.id}`}
									key={movie.id}
									className={`absolute w-50 bg-white rounded-[14px] overflow-hidden shadow-md hover:shadow-lg transition-shadow ${positions[index]}`}
								>
									{/* Poster */}
									<div className="h-35 relative overflow-hidden" style={{ background: color.bg }}>
										{movie.posterImage ? (
											<Image src={movie.posterImage} alt={movie.title} fill sizes="200px" className="object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<div className="w-16 h-16 rounded-full" style={{ background: color.dot }} />
											</div>
										)}
									</div>
									{/* Info */}
									<div className="p-3">
										<div className="text-sm font-semibold text-ink truncate">{movie.title}</div>
										<div className="flex items-center gap-1 mt-1">
											<Star size={11} className="text-yellow fill-yellow" />
											<span className="text-xs text-text-muted">
												{movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"} / 10
												{movie.genres?.[0] && <> · {movie.genres[0].genre.name}</>}
											</span>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
