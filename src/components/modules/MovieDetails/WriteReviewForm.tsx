"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ITag } from "@/types/tag.types";
import { createReviewZodSchema } from "@/zod/review.validation";

interface IUser {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface Props {
	movieId: string;
	user: IUser | null;
	tags: ITag[];
}

const WriteReviewForm = ({ movieId, user, tags }: Props) => {
	const router = useRouter();
	const [rating, setRating] = useState(0);
	const [hovered, setHovered] = useState(0);
	const [content, setContent] = useState("");
	const [hasSpoiler, setHasSpoiler] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const toggleTag = (tagId: string) => {
		setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
	};

	const minReviewLength = 10;
	const contentLength = content.trim().length;

	if (!user) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-6 flex flex-col items-center text-center gap-4">
				<div className="w-12 h-12 rounded-full bg-brand-softer flex items-center justify-center text-2xl">✍️</div>
				<div>
					<h2 className="text-[17px] font-bold text-ink mb-1">Want to write a review?</h2>
					<p className="text-[13px] text-text-muted">Login to share your thoughts with the community.</p>
				</div>
				<Link
					href="/login"
					className="bg-brand hover:bg-brand/90 text-white text-[14px] font-semibold px-6 py-3 rounded-[10px] transition-colors"
				>
					Login to Review
				</Link>
			</div>
		);
	}

	if (success) {
		return (
			<div className="bg-white rounded-[14px] border border-line-2 p-6 flex flex-col items-center text-center gap-3">
				<div className="w-12 h-12 rounded-full bg-green-soft flex items-center justify-center text-xl text-green font-bold">
					✓
				</div>
				<h2 className="text-[17px] font-bold text-ink">Review Submitted!</h2>
				<p className="text-[13px] text-text-muted">Your review is pending admin approval.</p>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const parsed = createReviewZodSchema.safeParse({
			movieId,
			rating,
			content,
			hasSpoiler,
			tagIds: selectedTags,
		});

		if (!parsed.success) {
			const formatted = parsed.error.format();
			const errorMessage =
				formatted.movieId?._errors?.[0] ||
				formatted.rating?._errors?.[0] ||
				formatted.content?._errors?.[0] ||
				formatted.hasSpoiler?._errors?.[0] ||
				formatted.tagIds?._errors?.[0] ||
				"Please fix the review form errors.";
			setError(errorMessage);
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ movieId, rating, content, hasSpoiler, tagIds: selectedTags }),
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
			<h2 className="text-[18px] font-bold text-ink mb-1">Write Your Review</h2>
			<p className="text-[13px] text-text-muted mb-5">Share your thoughts with the community</p>

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

				<div className="relative">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Share your thoughts about this movie..."
						rows={5}
						className={cn(
							"w-full border rounded-[10px] px-4 py-3 text-[14px] text-ink placeholder:text-text-subtle outline-none resize-none transition-colors",
							contentLength > 0 && contentLength < minReviewLength
								? "border-red-400 focus:border-red-400"
								: "border-line focus:border-brand",
						)}
					/>
					<div className="flex items-center justify-between mt-1 px-1">
						<span
							className={cn("text-[11px]", contentLength >= minReviewLength ? "text-green-500" : "text-text-subtle")}
						>
							{contentLength < minReviewLength
								? `Minimum ${minReviewLength - contentLength} more character${minReviewLength - contentLength === 1 ? "" : "s"} required`
								: "Minimum length reached"}
						</span>
						<span
							className={cn(
								"text-[11px] tabular-nums",
								contentLength >= minReviewLength ? "text-green-500" : "text-text-subtle",
							)}
						>
							{contentLength} / {minReviewLength} min
						</span>
					</div>
				</div>

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
					{loading ? "Submitting..." : "Submit Review"}
				</button>
			</form>
		</div>
	);
};

export default WriteReviewForm;
