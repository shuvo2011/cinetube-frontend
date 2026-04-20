import MovieDetailHero from "@/components/modules/MovieDetails/MovieDetailHero";
import MovieInfo from "@/components/modules/MovieDetails/MovieInfo";
import MovieStats from "@/components/modules/MovieDetails/MovieStats";
import SimilarMovies from "@/components/modules/MovieDetails/SimilarMovies";
import WriteReviewForm from "@/components/modules/MovieDetails/WriteReviewForm";
import ReviewList from "@/components/modules/MovieDetails/ReviewList";
import RentBuyCard from "@/components/modules/MovieDetails/RentBuyCard";
import { getMovieById } from "@/services/movie.services";
import { getReviewsByMovie } from "@/services/review.services";
import { getUserInfo } from "@/services/auth.services";
import { checkMovieAccess } from "@/services/payment.services";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTags } from "@/services/tag.services";
import EditReviewForm from "@/components/modules/MovieDetails/EditReviewForm";

export const dynamic = "force-dynamic";

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
	const reviews = reviewsRes.data ?? [];
	const reviewMeta = reviewsRes.meta;

	const existingReview = reviews.find((r: any) => r.userId === user?.id);
	const hasReviewed = !!existingReview;

	const access = movie.pricingType === "PREMIUM" && user ? await checkMovieAccess(id) : null;

	// console.log("movie", movie);

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
				<MovieDetailHero movie={movie} />

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
						{movie.pricingType === "PREMIUM" && (
							<RentBuyCard movie={movie} access={access} isLoggedIn={!!user} />
						)}
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
