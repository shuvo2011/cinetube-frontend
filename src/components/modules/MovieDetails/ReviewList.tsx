"use client";
import { cn } from "@/lib/utils";
import ReviewCard from "./ReviewCard";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
	reviews: any[];
	currentUser?: any;
	meta: any;
}

const ReviewList = ({ reviews, currentUser, meta }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

	const visibleReviews = reviews.filter((r) => {
		if (r.status === "PUBLISHED") return true;
		if (isAdmin) return true;
		if (currentUser && r.userId === currentUser.id && r.status === "PENDING") return true;
		return false;
	});

	const publishedCount = reviews.filter((r) => r.status === "PUBLISHED").length;
	const currentPage = parseInt(searchParams.get("reviewPage") ?? "1");
	const totalPages = meta?.totalPages ?? 1;

	const goToPage = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("reviewPage", String(page));
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-6">
			<div className="mb-6">
				<h2 className="text-[18px] font-bold text-ink">Community Reviews</h2>
				<p className="text-[13px] text-text-muted mt-1">{meta?.total ?? publishedCount} reviews</p>
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

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-line-2">
					<button
						onClick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						className="w-8 h-8 rounded-[8px] border border-line flex items-center justify-center text-[13px] text-text-muted hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
					>
						←
					</button>

					{Array.from({ length: totalPages }).map((_, i) => (
						<button
							key={i}
							onClick={() => goToPage(i + 1)}
							className={cn(
								"w-8 h-8 rounded-[8px] border text-[13px] font-medium transition-colors",
								currentPage === i + 1
									? "bg-brand text-white border-brand"
									: "border-line text-text-muted hover:border-brand hover:text-brand",
							)}
						>
							{i + 1}
						</button>
					))}

					<button
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="w-8 h-8 rounded-[8px] border border-line flex items-center justify-center text-[13px] text-text-muted hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
					>
						→
					</button>
				</div>
			)}
		</div>
	);
};

export default ReviewList;
