"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IMovie } from "@/types/movie.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

export const moviesColumns: ColumnDef<IMovie>[] = [
	{
		accessorKey: "title",
		header: "Movie",
		cell: ({ row }) => {
			const { title, posterImage, pricingType } = row.original;
			return (
				<div className="flex items-center gap-3">
					{posterImage ? (
						// eslint-disable-next-line @next/next/no-img-element
						<div className="relative h-12 w-8">
							<Image src={posterImage} alt={title} fill className="rounded object-cover shrink-0" />
						</div>
					) : (
						<div className="flex h-12 w-8 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground shrink-0">
							{title.slice(0, 2).toUpperCase()}
						</div>
					)}
					<div>
						<p className="text-sm font-medium">{title}</p>
						<Badge variant={pricingType === "FREE" ? "secondary" : "default"} className="mt-0.5 text-[10px]">
							{pricingType}
						</Badge>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "director",
		header: "Director",
		cell: ({ row }) => <span className="text-sm">{row.original.director}</span>,
	},
	{
		accessorKey: "releaseYear",
		header: "Year",
		cell: ({ row }) => <span className="text-sm">{row.original.releaseYear}</span>,
	},
	{
		accessorKey: "averageRating",
		header: "Rating",
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
				<span className="text-sm">{row.original.averageRating?.toFixed(1) ?? "—"}</span>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Added On",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
];
