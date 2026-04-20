"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IAdminComment } from "@/services/comment.services";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface Options {
	onDelete: (comment: IAdminComment) => void;
}

export const adminCommentColumns = ({ onDelete }: Options): ColumnDef<IAdminComment>[] => [
	{
		accessorKey: "content",
		header: "Comment",
		cell: ({ row }) => {
			const { content, parentId } = row.original;
			return (
				<div className="max-w-sm">
					{parentId && (
						<span className="text-[10px] text-text-muted bg-bg-2 px-1.5 py-0.5 rounded mr-1.5">reply</span>
					)}
					<span className="text-[13px] text-ink line-clamp-2">{content}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "review.movie.title",
		header: "Movie",
		cell: ({ row }) => (
			<Link
				href={`/movies/${row.original.review.movie.id}`}
				className="text-[13px] font-semibold text-ink hover:text-brand transition-colors"
			>
				{row.original.review.movie.title}
			</Link>
		),
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
		cell: ({ row }) => (
			<button
				onClick={() => onDelete(row.original)}
				className="text-[12px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-[6px] transition-colors"
			>
				Delete
			</button>
		),
	},
];
