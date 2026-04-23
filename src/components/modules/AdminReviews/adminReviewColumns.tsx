"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IAdminReview } from "@/services/review.services";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_STYLES: Record<string, string> = {
	PUBLISHED: "bg-green-50 text-green-700",
	PENDING: "bg-yellow-50 text-yellow-700",
	UNPUBLISHED: "bg-red-50 text-red-600",
	DRAFT: "bg-gray-100 text-gray-500",
};

interface Options {
	onView: (review: IAdminReview) => void;
	onApprove: (review: IAdminReview) => void;
	onUnpublish: (review: IAdminReview) => void;
}

export const adminReviewColumns = ({ onView, onApprove, onUnpublish }: Options): ColumnDef<IAdminReview>[] => [
	{
		accessorKey: "movie.title",
		header: "Movie",
		cell: ({ row }) => (
			<Link
				href={`/movies/${row.original.movie.id}`}
				className="text-[13px] font-semibold text-ink hover:text-brand transition-colors"
			>
				{row.original.movie.title}
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
		accessorKey: "rating",
		header: "Rating",
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<Star size={12} className="fill-yellow-400 text-yellow-400" />
				<span className="text-[13px] font-semibold">{row.original.rating}/10</span>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = row.original.status;
			return (
				<span
					className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
						STATUS_STYLES[s] ?? "bg-gray-100 text-gray-500"
					}`}
				>
					{s}
				</span>
			);
		},
	},
	{
		accessorKey: "_count.likes",
		header: "Likes",
		cell: ({ row }) => <span className="text-[13px] text-text-muted">{row.original._count.likes}</span>,
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
			const review = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem onClick={() => onView(review)}>View</DropdownMenuItem>

						{(review.status === "PENDING" || review.status === "UNPUBLISHED") && (
							<DropdownMenuItem onClick={() => onApprove(review)}>Publish</DropdownMenuItem>
						)}

						{review.status === "PUBLISHED" && (
							<DropdownMenuItem onClick={() => onUnpublish(review)}>Unpublish</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
