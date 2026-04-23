import DateCell from "@/components/shared/cell/DateCell";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IAdminComment } from "@/services/comment.services";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Options {
	onDelete: (comment: IAdminComment) => void;
	onView: (comment: IAdminComment) => void;
}

export const adminCommentColumns = ({ onDelete, onView }: Options): ColumnDef<IAdminComment>[] => [
	{
		accessorKey: "content",
		header: "Comment",
		cell: ({ row }) => {
			const { content, parentId } = row.original;

			const shortContent = content.split(" ").slice(0, 8).join(" ") + (content.split(" ").length > 8 ? "..." : "");

			return (
				<div className="max-w-sm">
					{parentId && <span className="text-[10px] text-text-muted bg-bg-2 px-1.5 py-0.5 rounded mr-1.5">reply</span>}
					<span className="text-[13px] text-ink">{shortContent}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "review.movie.title",
		header: "Movie",
		cell: ({ row }) => {
			const review = row.original.review;

			if (!review?.movie) {
				return <span className="text-[13px] text-text-muted">N/A</span>;
			}

			return (
				<Link
					href={`/movies/${review.movie.id}`}
					className="text-[13px] font-semibold text-ink hover:text-brand transition-colors"
				>
					{review.movie.title}
				</Link>
			);
		},
	},
	{
		accessorKey: "user.email",
		header: "User",
		cell: ({ row }) => (
			<div>
				<p className="text-[13px] font-medium text-ink">{row.original.user.name}</p>
				<p className="text-[11px] text-text-muted">{row.original.user.email}</p>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
	{
		id: "actions",
		header: "Actions",
		enableSorting: false,
		cell: ({ row }) => {
			const comment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="p-2 hover:bg-gray-100 rounded">
							<MoreHorizontal className="w-4 h-4" />
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onView(comment)}>View</DropdownMenuItem>

						<DropdownMenuItem onClick={() => onDelete(comment)} className="text-red-500">
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
