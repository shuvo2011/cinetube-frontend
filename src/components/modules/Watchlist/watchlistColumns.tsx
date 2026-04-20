"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IWatchlistItem } from "@/services/watchlist.services";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export const watchlistColumns: ColumnDef<IWatchlistItem>[] = [
	{
		accessorKey: "movie.title",
		header: "Movie",
		cell: ({ row }) => {
			const movie = row.original.movie;
			return (
				<div className="flex items-center gap-3">
					<div className="w-10 h-14 rounded-[6px] overflow-hidden bg-bg-2 relative shrink-0">
						{movie.posterImage ? (
							<Image src={movie.posterImage} alt={movie.title} fill className="object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<Play size={12} className="text-text-subtle" />
							</div>
						)}
					</div>
					<div>
						<Link
							href={`/movies/${movie.id}`}
							className="text-sm font-semibold text-ink hover:text-brand transition-colors"
						>
							{movie.title}
						</Link>
						<p className="text-xs text-text-muted mt-0.5">{movie.releaseYear}</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "movie.genres",
		header: "Genres",
		cell: ({ row }) => {
			const genres = row.original.movie.genres;
			return (
				<div className="flex flex-wrap gap-1">
					{genres.slice(0, 2).map((g) => (
						<span key={g.genre.id} className="text-[11px] bg-brand-softer text-brand px-2 py-0.5 rounded-full">
							{g.genre.name}
						</span>
					))}
					{genres.length > 2 && (
						<span className="text-[11px] text-text-muted">+{genres.length - 2}</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "movie.pricingType",
		header: "Pricing",
		cell: ({ row }) => {
			const { pricingType, rentPrice, buyPrice } = row.original.movie;
			if (pricingType === "FREE") {
				return <span className="text-[12px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Free</span>;
			}
			return (
				<div className="space-y-0.5">
					{rentPrice > 0 && <p className="text-[12px] text-text-muted">Rent ৳{rentPrice}</p>}
					{buyPrice > 0 && <p className="text-[12px] text-ink font-medium">Buy ৳{buyPrice}</p>}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Saved On",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
];
