"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { IAdminComment } from "@/services/comment.services";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	comment: IAdminComment | null;
}

export default function AdminCommentViewDialog({ open, onOpenChange, comment }: Props) {
	if (!comment) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Comment Details</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">User</p>
						<p className="font-medium">{comment.user.name}</p>
						<p className="text-xs text-gray-400">{comment.user.email}</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">Movie</p>
						<p className="font-medium">{comment.review?.movie?.title || "N/A"}</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">Comment</p>
						<div className="border rounded p-3 text-sm leading-relaxed">{comment.content}</div>
					</div>

					{comment.parentId && <p className="text-xs text-yellow-600">This is a reply comment</p>}
				</div>
			</DialogContent>
		</Dialog>
	);
}
