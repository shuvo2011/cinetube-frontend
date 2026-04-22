"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ITag } from "@/types/tag.types";

interface Props {
	review: any;
	tags: ITag[];
}

const EditReviewForm = ({ review, tags }: Props) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [rating, setRating] = useState(review?.rating ?? 0);
	const [hovered, setHovered] = useState(0);
	const [content, setContent] = useState(review?.content ?? "");
	const [hasSpoiler, setHasSpoiler] = useState(review?.hasSpoiler ?? false);
	const [selectedTags, setSelectedTags] = useState<string[]>(review?.tags?.map((t: any) => t.tagId) ?? []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const toggleTag = (tagId: string) => {
		setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
	};

	if (success) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-6 flex flex-col items-center text-center gap-3">
				<div className="w-12 h-12 rounded-full bg-green-soft flex items-center justify-center text-xl text-green font-bold">
					✓
				</div>
				<h2 className="text-[17px] font-bold text-ink">Review Updated!</h2>
				<p className="text-[13px] text-text-muted">Your review is pending admin approval.</p>
			</div>
		);
	}

	if (!isEditing) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-6 flex flex-col items-center text-center gap-3">
				<div className="w-12 h-12 rounded-full bg-brand-softer flex items-center justify-center text-2xl">✏️</div>
				<h2 className="text-[17px] font-bold text-ink">You've already reviewed this movie</h2>
				<p className="text-[13px] text-text-muted">
					Your review is {review?.status === "PENDING" ? "pending admin approval" : "published"}.
				</p>
				{review?.status === "PENDING" && (
					<button
						onClick={() => setIsEditing(true)}
						className="border border-brand text-brand text-[14px] font-semibold px-6 py-2.5 rounded-[10px] hover:bg-brand-softer transition-colors"
					>
						Edit Review
					</button>
				)}
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!rating || !content.trim()) return;
		setError("");
		setLoading(true);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${review.id}`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rating, content, hasSpoiler, tagIds: selectedTags }),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.message ?? "Something went wrong");
				return;
			}

			setSuccess(true);
			router.refresh();
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-6">
			<div className="flex items-center justify-between mb-1">
				<h2 className="text-[18px] font-bold text-ink">Edit Your Review</h2>
				<button
					onClick={() => setIsEditing(false)}
					className="text-[13px] text-text-muted hover:text-ink transition-colors"
				>
					Cancel
				</button>
			</div>
			<p className="text-[13px] text-text-muted mb-5">Update your thoughts about this movie</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex items-center gap-3 flex-wrap">
					<span className="text-[13px] text-text-muted">Your rating</span>
					<div className="flex gap-0.5">
						{Array.from({ length: 10 }).map((_, i) => (
							<button
								key={i}
								type="button"
								onMouseEnter={() => setHovered(i + 1)}
								onMouseLeave={() => setHovered(0)}
								onClick={() => setRating(i + 1)}
								className={cn(
									"text-[20px] transition-colors",
									(hovered || rating) > i ? "text-yellow" : "text-line opacity-40",
								)}
							>
								★
							</button>
						))}
					</div>
					{rating > 0 && <span className="text-[14px] font-bold text-ink">{rating}/10</span>}
				</div>

				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Share your thoughts about this movie..."
					rows={5}
					className="w-full border border-line rounded-[10px] px-4 py-3 text-[14px] text-ink placeholder:text-text-subtle outline-none focus:border-brand resize-none transition-colors"
				/>

				{tags.length > 0 && (
					<div>
						<p className="text-[12px] text-text-muted mb-2">Add tags</p>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<button
									key={tag.id}
									type="button"
									onClick={() => toggleTag(tag.id)}
									className={cn(
										"text-[12px] font-medium px-3 py-1 rounded-full border transition-all",
										selectedTags.includes(tag.id)
											? "bg-brand text-white border-brand"
											: "bg-white border-line text-text-muted hover:border-brand hover:text-brand",
									)}
								>
									#{tag.name}
								</button>
							))}
						</div>
					</div>
				)}

				{error && <p className="text-[13px] text-red-500">{error}</p>}

				<label className="flex items-center gap-2 text-[13px] text-text-base cursor-pointer select-none">
					<input
						type="checkbox"
						checked={hasSpoiler}
						onChange={(e) => setHasSpoiler(e.target.checked)}
						className="accent-brand"
					/>
					Spoiler warning
				</label>

				<button
					type="submit"
					disabled={loading || !rating || content.trim().length < 10}
					className="bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-[14px] font-semibold px-6 py-3 rounded-[10px] transition-colors"
				>
					{loading ? "Saving..." : "Update Review"}
				</button>
			</form>
		</div>
	);
};

export default EditReviewForm;
