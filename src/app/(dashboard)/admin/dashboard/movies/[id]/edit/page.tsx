import Link from "next/link";
import { notFound } from "next/navigation";
import { getCastMembers } from "@/services/castMember.services";
import { getGenresForAdmin } from "@/services/genre.services";
import { getMovieById } from "@/services/movie.services";
import { getPlatforms } from "@/services/platform.services";
import MovieForm from "@/components/modules/AdminMovies/MovieForm";

interface EditMoviePageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const res = await getMovieById(id);
	const movie = res?.data;

	return {
		title: movie
			? `Edit Movie ${movie.title} (${movie.releaseYear}) — CineTube Admin`
			: "Edit Movie - Update Media Entry | CineTube Admin",
		description: `Edit existing movie details. Update title, release year, genre, cast, ratings, description, poster image, and availability status on CineTube.`,
	};
}

const EditMoviePage = async ({ params }: EditMoviePageProps) => {
	const { id } = await params;

	const [movieRes, genresRes, platformsRes, castMembersRes] = await Promise.all([
		getMovieById(id),
		getGenresForAdmin("limit=100"),
		getPlatforms("limit=100"),
		getCastMembers("limit=100"),
	]);

	if (!movieRes?.data) {
		return notFound();
	}

	const genres = genresRes?.data ?? [];
	const platforms = platformsRes?.data ?? [];
	const castMembers = castMembersRes?.data ?? [];

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Edit Movie</h1>
					<p className="text-muted-foreground mt-1">Update the movie details and save your changes.</p>
				</div>
				<Link
					href="/admin/dashboard/movies"
					className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back to movies
				</Link>
			</div>

			<MovieForm mode="edit" movie={movieRes.data} genres={genres} platforms={platforms} castMembers={castMembers} />
		</div>
	);
};

export default EditMoviePage;
