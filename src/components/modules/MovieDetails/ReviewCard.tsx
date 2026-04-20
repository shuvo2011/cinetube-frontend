"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveReview, deleteReview, updateReviewStatus } from "@/services/review.services";
import CommentSection from "@/components/modules/Comments/CommentSection";

const AVATAR_COLORS = ["#F472B6", "#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#FB923C"];

interface Props {
	review: any;
	currentUser?: any;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const ReviewCard = ({ review, currentUser }: Props) => {
	const router = useRouter();
	const [deleted, setDeleted] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [likeCount, setLikeCount] = useState<number>(review.totalLikes ?? 0);
	const [liked, setLiked] = useState(false);
	const [likeLoading, setLikeLoading] = useState(false);
	const isPending = review.status === "PENDING";
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
	const isOwnReview = currentUser?.id === review.userId;

	if (deleted) return null;

	const name = review.user?.name ?? "Anonymous";
	const initials = name.slice(0, 2).toUpperCase();
	const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;

	const handleStatusChange = async (newStatus: string) => {
		await approveReview(review.id, newStatus);
		router.refresh();
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this review?")) return;
		await deleteReview(review.id);
		setDeleted(true);
		router.refresh();
	};

	const handleLike = async () => {
		if (!currentUser || isOwnReview || likeLoading) return;
		setLikeLoading(true);
		try {
			const res = await fetch(`${API_BASE}/review-likes/${review.id}`, {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();
			if (res.ok) {
				setLiked(data.data.liked);
				setLikeCount((c) => (data.data.liked ? c + 1 : c - 1));
			}
		} finally {
			setLikeLoading(false);
		}
	};

	return (
		<div className="py-5 first:pt-0 last:pb-0">
			{/* Pending badge — only admin */}
			{isPending && isAdmin && (
				<div className="flex items-center gap-2 text-[12px] text-yellow font-semibold mb-3">
					● Pending admin approval
				</div>
			)}

			{/* Spoiler warning */}
			{review.hasSpoiler && (
				<div className="text-[12px] text-amber-600 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2 mb-3">
					⚠ This review contains spoilers — read with caution
				</div>
			)}

			{/* Head */}
			<div className="flex items-start gap-3 mb-3">
				<div
					className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
					style={{ background: AVATAR_COLORS[colorIndex] }}
				>
					{initials}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[14px] font-semibold text-ink">{name}</p>
					<p className="text-[12px] text-text-muted">
						{new Date(review.createdAt).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</div>
				<span className="text-[15px] font-black text-ink shrink-0">{review.rating}/10</span>
			</div>

			{/* Body */}
			<div className="mb-3">
				<p className={cn("text-[14px] text-text-base leading-relaxed", !expanded && "line-clamp-3")}>
					{review.content}
				</p>
				{review.content?.length > 200 && (
					<button
						onClick={() => setExpanded(!expanded)}
						className="text-[13px] text-brand font-medium mt-1 hover:opacity-80 transition-opacity"
					>
						{expanded ? "Read less" : "Read more"}
					</button>
				)}
			</div>

			{/* Tags */}
			{review.tags?.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mb-3">
					{review.tags.map((t: any) => (
						<span key={t.tagId ?? t.id} className="text-[11px] text-brand bg-brand-softer px-2.5 py-1 rounded-full">
							#{t.tag?.name ?? t.name}
						</span>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center gap-4 text-[13px] text-text-muted">
				<button
					onClick={handleLike}
					disabled={likeLoading || !currentUser || isOwnReview}
					className={cn(
						"flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed",
						liked ? "text-red-500" : "hover:text-red-500 text-text-muted",
					)}
					title={isOwnReview ? "Cannot like your own review" : !currentUser ? "Login to like" : undefined}
				>
					<Heart size={14} className={liked ? "fill-red-500" : ""} />
					{likeCount} Likes
				</button>

				{/* Admin only */}
				{isAdmin && (
					<div className="ml-auto flex items-center gap-3">
						{review.status === "PENDING" && (
							<button
								onClick={() => handleStatusChange("PUBLISHED")}
								className="text-green font-semibold hover:opacity-80 transition-opacity"
							>
								✓ Approve
							</button>
						)}
						{review.status === "PUBLISHED" && (
							<button onClick={() => handleStatusChange("UNPUBLISHED")} className="hover:text-ink transition-colors">
								⊘ Unpublish
							</button>
						)}
						{review.status === "UNPUBLISHED" && (
							<button
								onClick={() => handleStatusChange("PUBLISHED")}
								className="text-green font-semibold hover:opacity-80 transition-opacity"
							>
								↑ Republish
							</button>
						)}
						<button onClick={handleDelete} className="text-red-500 hover:opacity-80 transition-opacity">
							✕ Delete
						</button>
					</div>
				)}
			</div>

			{/* Comments */}
			<div className="mt-3">
				<CommentSection
					reviewId={review.id}
					currentUser={currentUser}
					initialCount={review._count?.comments ?? review.comments?.length ?? 0}
				/>
			</div>
		</div>
	);
};

export default ReviewCard;
