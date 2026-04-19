import ReviewCard from "./ReviewCard";

interface Props {
	reviews: any[];
	currentUser?: any;
}

const ReviewList = ({ reviews, currentUser }: Props) => {
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

	// admin হলে সব দেখবে, না হলে শুধু published + নিজের pending
	const visibleReviews = reviews.filter((r) => {
		if (r.status === "PUBLISHED") return true;
		if (isAdmin) return true;
		if (currentUser && r.userId === currentUser.id) return true;
		return false;
	});
	const publishedCount = reviews.filter((r) => r.status === "PUBLISHED").length;
	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-6">
			<div className="mb-6">
				<h2 className="text-[18px] font-bold text-ink">Community Reviews</h2>
				<p className="text-[13px] text-text-muted mt-1">{publishedCount} reviews</p>
			</div>

			{visibleReviews.length === 0 ? (
				<p className="text-[14px] text-text-muted text-center py-10">No reviews yet. Be the first!</p>
			) : (
				<div className="divide-y divide-line-2">
					{visibleReviews.map((review) => (
						<ReviewCard key={review.id} review={review} currentUser={currentUser} />
					))}
				</div>
			)}
		</div>
	);
};

export default ReviewList;
