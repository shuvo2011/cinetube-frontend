"use client";

import { cn } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

const AVATAR_COLORS = ["#F472B6", "#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#FB923C"];

interface Props {
	review: any;
}

const ReviewCard = ({ review }: Props) => {
	const [showReplies, setShowReplies] = useState(false);
	const isPending = review.status === "PENDING";
	const initials = review.user?.name?.slice(0, 2).toUpperCase() ?? "??";
	const colorIndex = review.user?.name?.charCodeAt(0) % AVATAR_COLORS.length ?? 0;

	return (
		<div className={cn("py-5 first:pt-0 last:pb-0", isPending && "opacity-80")}>
			{/* Pending badge */}
			{isPending && (
				<div className="flex items-center gap-2 text-[12px] text-yellow font-semibold mb-3">
					● Pending admin approval
				</div>
			)}

			{/* Spoiler warning */}
			{review.containsSpoiler && (
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
					<p className="text-[14px] font-semibold text-ink">{review.user?.name ?? "Anonymous"}</p>
					<p className="text-[12px] text-text-muted">
						{new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
					</p>
				</div>
				<span className="text-[15px] font-black text-ink shrink-0">{review.rating}/10</span>
			</div>

			{/* Body */}
			<p className="text-[14px] text-text-base leading-relaxed mb-3">{review.reviewText}</p>

			{/* Tags */}
			{review.tags?.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mb-3">
					{review.tags.map((tag: string) => (
						<span key={tag} className="text-[11px] text-brand bg-brand-softer px-2.5 py-1 rounded-full">
							#{tag}
						</span>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center gap-4 text-[13px] text-text-muted">
				<button className="flex items-center gap-1.5 hover:text-brand transition-colors">
					<Heart size={14} />
					{review.totalLikes ?? 0} Likes
				</button>
				<button
					onClick={() => setShowReplies(!showReplies)}
					className="flex items-center gap-1.5 hover:text-brand transition-colors"
				>
					<MessageCircle size={14} />
					{review.comments?.length ?? 0} Comments
				</button>

				{/* Admin actions */}
				<div className="ml-auto flex items-center gap-3">
					{isPending ? (
						<button className="text-green font-semibold hover:opacity-80 transition-opacity">✓ Approve</button>
					) : (
						<button className="hover:text-ink transition-colors">⊘ Unpublish</button>
					)}
					<button className="text-red-500 hover:opacity-80 transition-opacity">✕ Delete</button>
				</div>
			</div>

			{/* Replies */}
			{showReplies && review.comments?.length > 0 && (
				<div className="mt-4 ml-10 space-y-4 border-l-2 border-line-2 pl-4">
					{review.comments.map((comment: any) => (
						<div key={comment.id}>
							<div className="flex items-center gap-2 mb-1">
								<div className="w-7 h-7 rounded-full bg-brand-softer text-brand flex items-center justify-center text-[10px] font-bold">
									{comment.user?.name?.slice(0, 2).toUpperCase()}
								</div>
								<span className="text-[13px] font-semibold text-ink">{comment.user?.name}</span>
								<span className="text-[11px] text-text-muted">· Reply</span>
							</div>
							<p className="text-[13px] text-text-base">{comment.content}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ReviewCard;
