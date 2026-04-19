"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";

interface IUser {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface Props {
	movieId: string;
	user: IUser | null;
}

const WriteReviewForm = ({ movieId, user }: Props) => {
	const [rating, setRating] = useState(0);
	const [hovered, setHovered] = useState(0);
	const [body, setBody] = useState("");
	const [spoiler, setSpoiler] = useState(false);
	const [tags, setTags] = useState("");
	const [loading, setLoading] = useState(false);

	// logged in না থাকলে prompt দেখাও
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!rating || !body.trim()) return;
		setLoading(true);
		// TODO: API call
		setLoading(false);
	};

	return (
		<div className="bg-white rounded-[14px] border border-line-2 p-6">
			<h2 className="text-[18px] font-bold text-ink mb-1">Write Your Review</h2>
			<p className="text-[13px] text-text-muted mb-5">Share your thoughts with the community</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Star rating picker */}
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
					value={body}
					onChange={(e) => setBody(e.target.value)}
					placeholder="Share your thoughts about this movie..."
					rows={5}
					className="w-full border border-line rounded-[10px] px-4 py-3 text-[14px] text-ink placeholder:text-text-subtle outline-none focus:border-brand resize-none transition-colors"
				/>

				<div className="flex items-center gap-5 flex-wrap">
					<label className="flex items-center gap-2 text-[13px] text-text-base cursor-pointer select-none">
						<input
							type="checkbox"
							checked={spoiler}
							onChange={(e) => setSpoiler(e.target.checked)}
							className="accent-brand"
						/>
						Spoiler warning
					</label>
					<input
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						placeholder='+ Add tags (e.g. "classic", "underrated")'
						className="flex-1 text-[13px] text-brand placeholder:text-brand/60 border-none outline-none bg-transparent"
					/>
				</div>

				<button
					type="submit"
					disabled={loading || !rating || !body.trim()}
					className="bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-[14px] font-semibold px-6 py-3 rounded-[10px] transition-colors"
				>
					{loading ? "Submitting..." : "Submit Review"}
				</button>
			</form>
		</div>
	);
};

export default WriteReviewForm;
