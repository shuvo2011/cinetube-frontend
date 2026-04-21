"use client";

import { cn } from "@/lib/utils";
import { IComment, ICommentReply } from "@/types/comment.types";
import { Trash2, CornerDownRight } from "lucide-react";
import { useState } from "react";

const AVATAR_COLORS = ["#F472B6", "#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#FB923C"];

const getAvatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

interface ReplyCardProps {
	reply: ICommentReply;
	currentUser: any;
	onDelete: (id: string) => void;
}

const ReplyCard = ({ reply, currentUser, onDelete }: ReplyCardProps) => {
	const isOwner = currentUser?.id === reply.userId;
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
	const name = reply.user?.name ?? "Anonymous";
	return (
		<div className="flex gap-2.5 py-3">
			<div
				className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
				style={{ background: getAvatarColor(name) }}
			>
				{getInitials(name)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-baseline gap-2 mb-1">
					<span className="text-[13px] font-semibold text-ink">{name}</span>
					<span className="text-[11px] text-text-muted">
						{new Date(reply.createdAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</span>
				</div>
				<p className="text-[13px] text-text-base leading-relaxed">{reply.content}</p>
			</div>
			{(isOwner || isAdmin) && (
				<button
					onClick={() => onDelete(reply.id)}
					className="text-text-subtle hover:text-red-500 transition-colors shrink-0 mt-0.5"
					title="Delete reply"
				>
					<Trash2 size={13} />
				</button>
			)}
		</div>
	);
};

interface ReplyFormProps {
	reviewId: string;
	parentId: string;
	onSubmit: (content: string) => Promise<void>;
	onCancel: () => void;
}

const ReplyForm = ({ onSubmit, onCancel }: ReplyFormProps) => {
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!value.trim()) return;
		setLoading(true);
		await onSubmit(value.trim());
		setValue("");
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 mt-2">
			<input
				autoFocus
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Write a reply..."
				maxLength={500}
				className="flex-1 border border-line rounded-[8px] px-3 py-2 text-[13px] text-ink placeholder:text-text-subtle outline-none focus:border-brand transition-colors"
			/>
			<button
				type="submit"
				disabled={loading || !value.trim()}
				className="bg-brand text-white text-[12px] font-semibold px-3 py-2 rounded-[8px] disabled:opacity-50 transition-colors hover:bg-brand/90"
			>
				{loading ? "..." : "Reply"}
			</button>
			<button
				type="button"
				onClick={onCancel}
				className="text-[12px] text-text-muted hover:text-ink px-2 transition-colors"
			>
				Cancel
			</button>
		</form>
	);
};

interface Props {
	comment: IComment;
	currentUser: any;
	onDelete: (id: string) => void;
	onReply: (parentId: string, content: string) => Promise<void>;
}

const CommentCard = ({ comment, currentUser, onDelete, onReply }: Props) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const isOwner = currentUser?.id === comment.userId;
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
	const name = comment.user?.name ?? "Anonymous";

	const handleReply = async (content: string) => {
		await onReply(comment.id, content);
		setShowReplyForm(false);
	};

	return (
		<div className="py-4 first:pt-0 last:pb-0">
			{/* Top-level comment */}
			<div className="flex gap-3">
				<div
					className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5"
					style={{ background: getAvatarColor(name) }}
				>
					{getInitials(name)}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-baseline gap-2 mb-1">
						<span className="text-[13px] font-semibold text-ink">{name}</span>
						<span className="text-[11px] text-text-muted">
							{new Date(comment.createdAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
					<p className="text-[13px] text-text-base leading-relaxed mb-2">{comment.content}</p>
					<div className="flex items-center gap-3">
						{currentUser && (
							<button
								onClick={() => setShowReplyForm((v) => !v)}
								className={cn(
									"flex items-center gap-1 text-[12px] font-medium transition-colors",
									showReplyForm ? "text-brand" : "text-text-muted hover:text-brand",
								)}
							>
								<CornerDownRight size={12} />
								Reply
							</button>
						)}
						{comment.replies?.length > 0 && (
							<span className="text-[12px] text-text-subtle">
								{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
							</span>
						)}
					</div>

					{showReplyForm && (
						<ReplyForm
							reviewId={comment.reviewId}
							parentId={comment.id}
							onSubmit={handleReply}
							onCancel={() => setShowReplyForm(false)}
						/>
					)}
				</div>
				{(isOwner || isAdmin) && (
					<button
						onClick={() => onDelete(comment.id)}
						className="text-text-subtle hover:text-red-500 transition-colors shrink-0 mt-0.5"
						title="Delete comment"
					>
						<Trash2 size={14} />
					</button>
				)}
			</div>

			{/* Replies */}
			{comment.replies?.length > 0 && (
				<div className="ml-11 mt-1 border-l-2 border-line-2 pl-4 divide-y divide-line-2">
					{comment.replies.map((reply) => (
						<ReplyCard key={reply.id} reply={reply} currentUser={currentUser} onDelete={onDelete} />
					))}
				</div>
			)}
		</div>
	);
};

export default CommentCard;
