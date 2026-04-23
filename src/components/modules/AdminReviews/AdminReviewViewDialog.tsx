"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IAdminReview } from "@/services/review.services";
import { Star } from "lucide-react";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: IAdminReview | null;
}

const AdminReviewViewDialog = ({ open, onOpenChange, review }: Props) => {
	if (!review) return null;

	const tags = review.tags ?? [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="!w-[95vw] !max-w-4xl max-h-[85vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle>Review Details</DialogTitle>
				</DialogHeader>

				<div className="space-y-5 overflow-y-auto pr-3 max-h-[70vh]">
					<div>
						<p className="text-sm text-muted-foreground">Movie</p>
						<p className="font-semibold">{review.movie.title}</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground">User</p>
						<p className="font-semibold">{review.user.name}</p>
						<p className="text-sm text-muted-foreground">{review.user.email}</p>
					</div>

					<div className="flex items-center gap-2">
						<Star size={16} className="fill-yellow-400 text-yellow-400" />
						<span className="font-semibold">{review.rating}/10</span>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-1">Status</p>
						<p className="font-medium">{review.status}</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-2">Review Content</p>
						<div className="rounded-lg border bg-muted/30 p-4 text-sm leading-8 whitespace-pre-wrap break-words">
							{review.content}
						</div>
					</div>

					{tags.length > 0 && (
						<div>
							<p className="text-sm text-muted-foreground mb-2">Tags</p>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag: { id: string; name: string }) => (
									<span key={tag.id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
										#{tag.name}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-muted-foreground">Likes</p>
							<p className="font-medium">{review._count.likes}</p>
						</div>
						<div>
							<p className="text-muted-foreground">Comments</p>
							<p className="font-medium">{review._count.comments}</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AdminReviewViewDialog;
