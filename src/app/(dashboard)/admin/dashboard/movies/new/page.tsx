export const dynamic = "force-dynamic";
import Link from "next/link";
import { getCastMembers } from "@/services/castMember.services";
import { getGenresForAdmin } from "@/services/genre.services";
import { getPlatforms } from "@/services/platform.services";
import MovieForm from "@/components/modules/AdminMovies/MovieForm";

export const metadata = {
	title: "Add New Movie - Create Media Entry - CineTube Admin",
	description:
		"Add a new movie to the CineTube library. Fill in details like title, release year, genre, cast, ratings, description, and poster image.",
};

const NewMoviePage = async () => {
	const [genresRes, platformsRes, castMembersRes] = await Promise.all([
		getGenresForAdmin("limit=100"),
		getPlatforms("limit=100"),
		getCastMembers("limit=100"),
	]);

	const genres = genresRes?.data ?? [];
	const platforms = platformsRes?.data ?? [];
	const castMembers = castMembersRes?.data ?? [];

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Add Movie</h1>
					<p className="text-muted-foreground mt-1">Create a new movie and add it to the library.</p>
				</div>
				<Link
					href="/admin/dashboard/movies"
					className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back to movies
				</Link>
			</div>

			<MovieForm mode="create" genres={genres} platforms={platforms} castMembers={castMembers} />
		</div>
	);
};

export default NewMoviePage;
