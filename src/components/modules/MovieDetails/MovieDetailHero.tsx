"use client";

import { IMovie } from "@/types/movie.types";
import { Bookmark, Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#F472B6", "#60A5FA", "#A78BFA", "#FBBF24", "#34D399", "#FB923C"];

interface Props {
	movie: IMovie;
}

const MovieDetailHero = ({ movie }: Props) => {
	const isFree = movie.pricingType === "FREE";
	console.log(movie.movieCasts);
	return (
		<section className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr] gap-8 md:gap-10 pb-12">
			{/* Poster */}
			<div className="relative rounded-[18px] overflow-hidden bg-gradient-to-br from-brand-softer to-brand-soft aspect-[2/3] flex items-center justify-center">
				{movie.posterImage ? (
					<Image
						src={movie.posterImage}
						alt={movie.title}
						fill
						sizes="(max-width: 768px) 100vw, 360px"
						className="object-cover"
					/>
				) : (
					<div className="w-40 h-40 rounded-full bg-brand/40" />
				)}
				{/* Badges */}
				<div className="absolute top-4 left-4 flex gap-2">
					<span
						className={cn(
							"text-[11px] font-semibold px-2.5 py-1 rounded-full",
							isFree ? "bg-green-soft text-green" : "bg-brand-softer text-brand",
						)}
					>
						{isFree ? "Free" : "Premium"}
					</span>
					{movie.platforms?.[0] && (
						<span className="text-[11px] font-semibold bg-white text-ink px-2.5 py-1 rounded-full">
							{movie.platforms[0].platform.name}
						</span>
					)}
				</div>
				{/* Stream ribbon */}
				{movie.streamingUrl && (
					<div className="absolute bottom-4 left-4 right-4 bg-ink/85 text-white px-4 py-3 rounded-[10px] flex justify-between items-center text-[12px]">
						<span className="opacity-70">Available on</span>
						<b>{movie.platforms?.[0]?.platform.name ?? "Stream"}</b>
					</div>
				)}
			</div>

			{/* Info */}
			<div className="pt-1">
				<p className="text-[12px] font-semibold text-text-muted tracking-[0.06em] mb-3">
					{movie.genres?.map((g) => g.genre.name).join(" · ")}
				</p>
				<h1 className="text-[42px] lg:text-[54px] font-black tracking-[-0.03em] text-ink leading-none mb-5">
					{movie.title}
				</h1>

				{/* Meta pills */}
				<div className="flex flex-wrap gap-2 mb-6">
					{movie.releaseYear && <span className="meta-pill">{movie.releaseYear}</span>}
					{movie.platforms?.map((p) => (
						<span key={p.platform.id} className="text-[13px] px-3 py-1 rounded-full bg-ink text-white font-semibold">
							{p.platform.name}
						</span>
					))}
					<span
						className={cn(
							"text-[13px] px-3 py-1 rounded-full font-semibold",
							isFree ? "bg-green-soft text-green" : "bg-brand-softer text-brand",
						)}
					>
						{isFree ? "Free" : "Premium"}
					</span>
				</div>

				{/* Rating block */}
				<div className="flex items-center gap-5 py-5 border-y border-line-2 mb-7">
					<div className="text-[52px] font-black tracking-[-0.03em] text-ink leading-none">
						{movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}
						<span className="text-[20px] text-text-subtle font-medium">/10</span>
					</div>
					<div>
						<div className="text-yellow text-[18px] tracking-[2px] mb-1">
							{"★".repeat(Math.round((movie.averageRating ?? 0) / 2))}
							<span className="opacity-20">{"★".repeat(5 - Math.round((movie.averageRating ?? 0) / 2))}</span>
						</div>
						<p className="text-[13px] text-text-muted">
							Based on <b className="text-ink">{movie.totalReviews ?? 0}</b> community reviews
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3 mb-8">
					<button className="flex items-center gap-2 px-5 py-3 rounded-[10px] border border-line text-[14px] font-semibold text-ink hover:border-ink transition-colors">
						<Bookmark size={16} />
						Add to Watchlist
					</button>
					{movie.streamingUrl && (
						<a
							href={movie.streamingUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-white text-[14px] font-semibold hover:bg-ink/90 transition-colors"
						>
							<Play size={16} className="fill-white" />
							Stream Now
						</a>
					)}
				</div>

				{/* Director & Cast */}
				<div>
					<p className="text-[11px] font-bold tracking-[0.14em] text-text-muted uppercase mb-3">Director & Cast</p>
					<div className="flex flex-wrap gap-2">
						{[
							<div
								key="director"
								className="flex items-center gap-2 px-3 py-2 bg-ink text-white rounded-full text-[13px] font-medium"
							>
								<div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold">
									{movie.director?.slice(0, 2).toUpperCase()}
								</div>
								{movie.director} · Director
							</div>,
							...(movie.movieCasts?.map((c, i) => (
								<div
									key={c.castMemberId}
									className="flex items-center gap-2 px-3 py-2 bg-white border border-line-2 rounded-full text-[13px] text-ink }"
								>
									<div
										className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
										style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
									>
										{c.castMember?.name?.slice(0, 2).toUpperCase()}
									</div>
									{c.castMember?.name}
								</div>
							)) ?? []),
						]}
					</div>
				</div>
			</div>
		</section>
	);
};

export default MovieDetailHero;
