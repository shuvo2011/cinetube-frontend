import { getMovies } from "@/services/movie.services";
import { IMovie } from "@/types/movie.types";
import Image from "next/image";
import Link from "next/link";

const COLORS = ["#E2E1FB", "#FDF1D5", "#DDF4E5", "#DBEAFE"];
const DOTS = ["#A8A4F0", "#F2C76C", "#7FCFA2", "#93C5FD"];

interface Props {
	genres: IMovie["genres"];
	currentId: string;
}

const SimilarMovies = async ({ genres, currentId }: Props) => {
	const genreId = genres?.[0]?.genre?.id;
	if (!genreId) return null;

	const res = await getMovies(`genreId=${genreId}&limit=4`);
	const similar = (res?.data ?? []).filter((m: IMovie) => m.id !== currentId).slice(0, 3);

	if (similar.length === 0) return null;
	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-5">
			<p className="text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase mb-4">Similar Movies</p>
			<div className="space-y-3">
				{similar.map((m: IMovie, i: number) => (
					<Link
						key={m.id}
						href={`/movies/${m.id}`}
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0 bg-bg-2">
							{m.posterImage ? (
								<Image
									src={m.posterImage}
									alt={m.title}
									width={48}
									height={48}
									className="object-cover w-full h-full"
								/>
							) : (
								<div
									className="w-full h-full flex items-center justify-center"
									style={{ background: COLORS[i % COLORS.length] }}
								>
									<div className="w-5 h-5 rounded-full" style={{ background: DOTS[i % DOTS.length] }} />
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-[13px] font-semibold text-ink truncate">{m.title}</p>
							<p className="text-[11px] text-text-muted">
								{m.genres
									?.slice(0, 1)
									.map((g) => g.genre.name)
									.join()}{" "}
								· {m.releaseYear}
							</p>
						</div>
						<span className="text-[12px] font-bold text-ink shrink-0">
							★ {m.averageRating ? m.averageRating.toFixed(1) : "N/A"}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

export default SimilarMovies;
