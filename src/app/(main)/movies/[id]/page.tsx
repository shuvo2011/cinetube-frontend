import MovieDetailHero from "@/components/modules/MovieDetails/MovieDetailHero";
import MovieInfo from "@/components/modules/MovieDetails/MovieInfo";
import MovieStats from "@/components/modules/MovieDetails/MovieStats";
import SimilarMovies from "@/components/modules/MovieDetails/SimilarMovies";
import WriteReviewForm from "@/components/modules/MovieDetails/WriteReviewForm";
import ReviewList from "@/components/modules/MovieDetails/ReviewList";
import RentBuyCard from "@/components/modules/MovieDetails/RentBuyCard";
import { getMovieById } from "@/services/movie.services";
import { getReviewsByMovie, getMyReviewForMovie, getPendingReviewsForMovie } from "@/services/review.services";
import { getUserInfo } from "@/services/auth.services";
import { checkMovieAccess } from "@/services/payment.services";
import { isMovieInWatchlist } from "@/services/watchlist.services";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTags } from "@/services/tag.services";
import EditReviewForm from "@/components/modules/MovieDetails/EditReviewForm";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const res = await getMovieById(id);
	const movie = res?.data;

	return {
		title: movie ? `${movie.title} (${movie.releaseYear}) — CineTube` : "Movie Details — CineTube",
		description: movie?.synopsis ?? `Watch reviews, ratings, and details for ${movie?.title} on CineTube.`,
	};
}

interface MovieDetailsPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<Record<string, string>>;
}

const MovieDetailsPage = async ({ params, searchParams }: MovieDetailsPageProps) => {
	const { id } = await params;
	const sp = await searchParams;
	const reviewPage = parseInt(sp.reviewPage ?? "1");

	const [movieRes, reviewsRes, user, tags] = await Promise.all([
		getMovieById(id),
		getReviewsByMovie(id, reviewPage),
		getUserInfo(),
		getTags(),
	]);

	if (!movieRes?.data) return notFound();

	const movie = movieRes.data;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const publishedReviews: any[] = reviewsRes.data ?? [];
	const reviewMeta = reviewsRes.meta;

	const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

	const [myReview, pendingReviews] = await Promise.all([
		user && !isAdmin ? getMyReviewForMovie(id) : Promise.resolve(null),
		isAdmin ? getPendingReviewsForMovie(id) : Promise.resolve([]),
	]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const publishedIds = new Set(publishedReviews.map((r: any) => r.id));
	const extraReviews = isAdmin
		? // eslint-disable-next-line @typescript-eslint/no-explicit-any
			(pendingReviews as any[]).filter((r: any) => !publishedIds.has(r.id))
		: myReview && !publishedIds.has(myReview.id)
			? [myReview]
			: [];
	const reviews = [...extraReviews, ...publishedReviews];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const existingReview = myReview ?? reviews.find((r: any) => r.userId === user?.id);
	const hasReviewed = !!existingReview;

	const [access, inWatchlist] = await Promise.all([
		movie.pricingType === "PREMIUM" && user ? checkMovieAccess(id) : Promise.resolve(null),
		user ? isMovieInWatchlist(id) : Promise.resolve(false),
	]);

	return (
		<div className="bg-bg-2 min-h-screen">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				{/* Breadcrumb */}
				<div className="py-5 text-[13px] text-text-muted">
					<Link href="/movies" className="hover:text-brand transition-colors">
						Movies
					</Link>
					<span className="mx-2">·</span>
					<span className="text-ink font-medium">{movie.title}</span>
				</div>

				{/* Hero */}
				<MovieDetailHero movie={movie} access={access} isLoggedIn={!!user} initialInWatchlist={inWatchlist} />

				{/* Body */}
				<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 pb-20">
					{/* Main */}
					<div className="space-y-6">
						{hasReviewed ? (
							<EditReviewForm review={existingReview} tags={tags ?? []} />
						) : (
							<WriteReviewForm movieId={movie.id} user={user} tags={tags ?? []} />
						)}
						<ReviewList reviews={reviews} currentUser={user} meta={reviewMeta} />
					</div>

					{/* Sidebar */}
					<div className="space-y-5">
						{movie.pricingType === "PREMIUM" && <RentBuyCard movie={movie} access={access} isLoggedIn={!!user} />}
						<MovieInfo movie={movie} />
						<MovieStats movie={movie} />
						<SimilarMovies genres={movie.genres} currentId={movie.id} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieDetailsPage;
