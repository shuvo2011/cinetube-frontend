"use client";

import { IComment } from "@/types/comment.types";
import { MessageCircle, Plus, X } from "lucide-react";
import { useState } from "react";
import CommentCard from "./CommentCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
	reviewId: string;
	currentUser: any;
	initialCount: number;
}

const CommentSection = ({ reviewId, currentUser, initialCount }: Props) => {
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState<IComment[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [count, setCount] = useState(initialCount);

	const loadComments = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/comments/review/${reviewId}?limit=100`, {
				credentials: "include",
			});
			const data = await res.json();
			const fetched: IComment[] = data.data ?? [];
			setComments(fetched);
			const total = fetched.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);
			setCount(total);
		} catch {
		} finally {
			setLoading(false);
			setLoaded(true);
		}
	};

	const handleToggle = () => {
		if (!open && !loaded) loadComments();
		setOpen((v) => !v);
		if (open) setShowForm(false);
	};

	const handleAddComment = () => {
		if (!open) {
			if (!loaded) loadComments();
			setOpen(true);
		}
		setShowForm(true);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newComment.trim()) return;
		setError("");
		setSubmitting(true);
		try {
			const res = await fetch(`${API_BASE}/comments`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ reviewId, content: newComment.trim() }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.message ?? "Something went wrong");
				return;
			}
			setComments((prev) => [data.data, ...prev]);
			setCount((c) => c + 1);
			setNewComment("");
			setShowForm(false);
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleReply = async (parentId: string, content: string) => {
		const res = await fetch(`${API_BASE}/comments`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ reviewId, content, parentId }),
		});
		const data = await res.json();
		if (!res.ok) return;

		setComments((prev) =>
			prev.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies ?? []), data.data] } : c)),
		);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this comment?")) return;
		const res = await fetch(`${API_BASE}/comments/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		if (!res.ok) return;

		setComments((prev) => {
			const isTopLevel = prev.some((c) => c.id === id);
			if (isTopLevel) {
				setCount((c) => c - 1);
				return prev.filter((c) => c.id !== id);
			}
			return prev.map((c) => ({
				...c,
				replies: c.replies?.filter((r) => r.id !== id) ?? [],
			}));
		});
	};

	return (
		<div>
			<div className="flex items-center gap-3">
				<button
					onClick={handleToggle}
					className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-brand transition-colors"
				>
					<MessageCircle size={14} />
					{count} {count === 1 ? "Comment" : "Comments"}
				</button>

				{currentUser && (
					<button
						onClick={handleAddComment}
						className="flex items-center gap-1 text-[12px] font-medium text-brand hover:opacity-80 transition-opacity"
					>
						<Plus size={13} />
						Add Comment
					</button>
				)}
			</div>

			{open && (
				<div className="mt-4 ml-10 border-t border-line-2 pt-4 space-y-4">
					{showForm && currentUser && (
						<form onSubmit={handleSubmit} className="space-y-2">
							<textarea
								autoFocus
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Write a comment..."
								maxLength={500}
								rows={3}
								className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] text-ink placeholder:text-text-subtle outline-none focus:border-brand resize-none transition-colors"
							/>
							{error && <p className="text-[12px] text-red-500">{error}</p>}
							<div className="flex items-center gap-2">
								<button
									type="submit"
									disabled={submitting || !newComment.trim()}
									className="bg-brand text-white text-[12px] font-semibold px-4 py-2 rounded-[8px] disabled:opacity-50 transition-colors hover:bg-brand/90"
								>
									{submitting ? "Posting..." : "Post Comment"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setError("");
										setNewComment("");
									}}
									className="flex items-center gap-1 text-[12px] text-text-muted hover:text-ink transition-colors"
								>
									<X size={13} />
									Cancel
								</button>
							</div>
						</form>
					)}

					{loading && <p className="text-[13px] text-text-muted text-center py-2">Loading comments...</p>}

					{loaded && comments.length === 0 && !showForm && (
						<p className="text-[13px] text-text-muted text-center py-2">
							No comments yet.{currentUser ? "" : " Login to be the first!"}
						</p>
					)}

					{comments.length > 0 && (
						<div className="divide-y divide-line-2">
							{comments.map((comment) => (
								<CommentCard
									key={comment.id}
									comment={comment}
									currentUser={currentUser}
									onDelete={handleDelete}
									onReply={handleReply}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CommentSection;
