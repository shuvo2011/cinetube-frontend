import { cn } from "@/lib/utils";
import { IMovie } from "@/types/movie.types";
import { BookmarkCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CARD_COLORS = [
	{ bg: "#FCE3E6", circle: "#F3B0B8" },
	{ bg: "#FDF1D5", circle: "#F2C76C" },
	{ bg: "#DDF4E5", circle: "#7FCFA2" },
	{ bg: "#E2E1FB", circle: "#A8A4F0" },
	{ bg: "#DBEAFE", circle: "#93C5FD" },
	{ bg: "#FEF3C7", circle: "#FCD34D" },
	{ bg: "#FCE7F3", circle: "#F9A8D4" },
	{ bg: "#D1FAE5", circle: "#6EE7B7" },
];

interface MovieCardProps {
	movie: IMovie;
	index: number;
}

const MovieCard = ({ movie, index }: MovieCardProps) => {
	const color = CARD_COLORS[index % CARD_COLORS.length];
	const isFree = movie.pricingType === "FREE";

	return (
		<Link
			href={`/movies/${movie.id}`}
			className="group bg-white rounded-[14px] overflow-hidden border border-line-2 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,15,16,0.08)] hover:border-transparent transition-all duration-200 flex flex-col"
		>
			{/* Poster */}
			<div
				className="relative overflow-hidden flex items-center justify-center"
				style={{ aspectRatio: "16/11", background: color.bg }}
			>
				{movie.posterImage ? (
					<Image
						src={movie.posterImage}
						alt={movie.title}
						fill
						sizes="(max-width: 768px) 50vw, 25vw"
						className="object-cover"
					/>
				) : (
					<div className="w-[110px] h-[110px] rounded-full" style={{ background: color.circle }} />
				)}

				{/* Badges */}
				<div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
					<span
						className={cn(
							"text-[10px] font-semibold px-2.5 py-1 rounded-full",
							isFree ? "bg-green-soft text-green" : "bg-brand-softer text-brand",
						)}
					>
						{isFree ? "Free" : "Premium"}
					</span>
					{movie.platforms?.[0] && (
						<span className="text-[10px] font-semibold bg-white text-ink-2 px-2.5 py-1 rounded-full">
							{movie.platforms[0].platform.name}
						</span>
					)}
				</div>
			</div>

			{/* Body */}
			<div className="p-[18px] pb-4 flex flex-col flex-1">
				<h3 className="text-[17px] font-bold text-ink tracking-[-0.01em] mb-1 truncate">{movie.title}</h3>
				<p className="text-[12px] text-text-muted mb-2.5">
					{movie.genres
						?.slice(0, 2)
						.map((g) => g.genre.name)
						.join(" · ")}
					{movie.releaseYear && <span className="before:content-['·'] before:mx-1">{movie.releaseYear}</span>}
				</p>

				<div className="flex items-center justify-between mt-auto">
					<div className="flex items-center gap-1.5">
						<span className="text-yellow text-[10px] tracking-[-1px]">
							{"★".repeat(Math.round((movie.averageRating ?? 0) / 2))}
							<span className="opacity-20">{"★".repeat(5 - Math.round((movie.averageRating ?? 0) / 2))}</span>
						</span>
						<span className="text-[13px] font-bold text-ink">
							{movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}
						</span>
						{movie.totalReviews ? <span className="text-[11px] text-text-subtle">({movie.totalReviews})</span> : null}
					</div>
					<div className="flex items-center gap-1 text-[12px] text-brand font-medium">
						<BookmarkCheck size={11} className="text-brand" />
						<span>{movie?._count?.watchlists ?? 0}</span>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="px-[18px] py-3 border-t border-line-2 flex items-center justify-between">
				<span className="text-[12px] text-text-muted truncate">{movie.director}</span>
			</div>
		</Link>
	);
};

export default MovieCard;
