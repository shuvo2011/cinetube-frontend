"use client";

import { cn } from "@/lib/utils";
import { IComment, ICommentReply } from "@/types/comment.types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

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
			<div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 bg-bg-2">
				{reply.user?.image ? (
					<Image src={reply.user.image} alt={name} width={28} height={28} className="object-cover w-full h-full" />
				) : (
					<div
						className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white"
						style={{ background: getAvatarColor(name) }}
					>
						{getInitials(name)}
					</div>
				)}
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
				>
					<Trash2 size={13} />
				</button>
			)}
		</div>
	);
};

interface ReplyFormProps {
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
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Write a reply..."
				className="flex-1 border rounded px-3 py-2 text-sm"
			/>
			<button type="submit" disabled={loading} className="bg-brand text-white px-3 py-2 rounded">
				{loading ? "..." : "Reply"}
			</button>
			<button type="button" onClick={onCancel} className="text-sm text-muted-foreground">
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

	return (
		<div className="py-4">
			<div className="flex gap-3">
				{/* Avatar */}
				<div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-0.5 bg-bg-2">
					{comment.user?.image ? (
						<Image src={comment.user.image} alt={name} width={32} height={32} className="object-cover w-full h-full" />
					) : (
						<div
							className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
							style={{ background: getAvatarColor(name) }}
						>
							{getInitials(name)}
						</div>
					)}
				</div>

				<div className="flex-1">
					<div className="flex gap-2 items-center">
						<span className="font-semibold text-sm">{name}</span>
						<span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
					</div>

					<p className="text-sm mt-1">{comment.content}</p>

					<div className="flex gap-3 mt-2">
						<button onClick={() => setShowReplyForm((v) => !v)} className="text-xs text-muted-foreground">
							Reply
						</button>
					</div>

					{showReplyForm && (
						<ReplyForm onSubmit={(content) => onReply(comment.id, content)} onCancel={() => setShowReplyForm(false)} />
					)}

					{/* Replies */}
					{comment.replies?.length > 0 && (
						<div className="ml-10 mt-3">
							{comment.replies.map((reply) => (
								<ReplyCard key={reply.id} reply={reply} currentUser={currentUser} onDelete={onDelete} />
							))}
						</div>
					)}
				</div>

				{(isOwner || isAdmin) && (
					<button onClick={() => onDelete(comment.id)} className="text-red-500">
						<Trash2 size={14} />
					</button>
				)}
			</div>
		</div>
	);
};

export default CommentCard;
