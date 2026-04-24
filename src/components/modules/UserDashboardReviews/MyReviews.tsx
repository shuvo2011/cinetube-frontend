"use client";

import DataTable from "@/components/shared/table/DataTable";
import DateCell from "@/components/shared/cell/DateCell";
import { getMyReviews } from "@/services/review.services";
import { PaginationMeta } from "@/types/api.types";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Star } from "lucide-react";
import { IMyReview } from "@/types/reviews.types";

const columns: ColumnDef<IMyReview>[] = [
	{
		accessorKey: "content",
		header: "Review",
		cell: ({ row }) => {
			const content = row.original.content;
			const shortContent = content.split(" ").slice(0, 10).join(" ") + (content.split(" ").length > 10 ? "..." : "");

			return (
				<div className="">
					<p className="text-[13px] font-medium text-ink line-clamp-1">{shortContent}</p>
					<div className="mt-1 flex items-center gap-1 text-[12px] text-text-muted">
						<Star size={12} className="fill-yellow-400 text-yellow-400" />
						<span>{row.original.rating}/10</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "movie.title",
		header: "Movie",
		cell: ({ row }) => (
			<div>
				<p className="text-[13px] font-semibold text-ink">{row.original.movie.title}</p>
				<p className="text-[11px] text-text-muted">{row.original.movie.releaseYear}</p>
			</div>
		),
	},
	{
		accessorKey: "_count.likes",
		header: "Likes",
		cell: ({ row }) => <span className="text-[13px] text-text-muted">{row.original._count.likes}</span>,
	},
	{
		accessorKey: "createdAt",
		header: "Review Time",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;

			const styles: Record<string, string> = {
				PUBLISHED: "bg-green-50 text-green-700 border-green-200",
				PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
				UNPUBLISHED: "bg-red-50 text-red-600 border-red-200",
				DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
			};

			return (
				<span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${styles[status]}`}>{status}</span>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		enableSorting: false,
		cell: ({ row }) => (
			<Link href={`/movies/${row.original.movie.id}`} className="text-[12px] font-semibold text-brand hover:underline">
				View Review
			</Link>
		),
	},
];

const MyReviews = () => {
	const {
		data: reviewsResponse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["my-reviews"],
		queryFn: () => getMyReviews("page=1&limit=10"),
	});

	const reviews: IMyReview[] = reviewsResponse?.data ?? [];
	const meta: PaginationMeta | undefined = reviewsResponse?.meta;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-[22px] font-bold text-ink">My Reviews</h1>
				<p className="text-[13px] text-text-muted mt-1">View your movie reviews and engagement.</p>
			</div>

			<DataTable
				data={reviews}
				columns={columns}
				isLoading={isLoading || isFetching}
				emptyMessage="You have not written any reviews yet."
				meta={meta}
			/>
		</div>
	);
};

export default MyReviews;
