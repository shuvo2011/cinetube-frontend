import ReviewCard from "./ReviewCard";

interface Props {
	reviews: any[];
}

const ReviewList = ({ reviews }: Props) => (
	<div className="bg-white rounded-[14px] border border-line-2 p-6">
		<div className="flex items-start justify-between gap-4 mb-6">
			<div>
				<h2 className="text-[18px] font-bold text-ink">Community Reviews</h2>
				<p className="text-[13px] text-text-muted mt-1">{reviews.length} reviews</p>
			</div>
		</div>

		{reviews.length === 0 ? (
			<p className="text-[14px] text-text-muted text-center py-10">No reviews yet. Be the first!</p>
		) : (
			<div className="divide-y divide-line-2">
				{reviews.map((review) => (
					<ReviewCard key={review.id} review={review} />
				))}
			</div>
		)}
	</div>
);

export default ReviewList;
