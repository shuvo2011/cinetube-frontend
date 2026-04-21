"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IPlatform } from "@/types/platform.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const platformsColumns: ColumnDef<IPlatform>[] = [
	{
		accessorKey: "name",
		header: "Platform",
		cell: ({ row }) => {
			const { name, logo } = row.original;

			return (
				<div className="flex items-center gap-3">
					{logo ? (
						<Image src={logo} alt={name} width={28} height={28} className="h-7 w-7 rounded-md object-cover" />
					) : (
						<div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-100 text-rose-600 text-xs font-bold">
							{name.slice(0, 2).toUpperCase()}
						</div>
					)}
					<span className="text-sm font-medium">{name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "website",
		header: "Website",
		cell: ({ row }) =>
			row.original.website ? (
				<a
					href={row.original.website}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-blue-600 hover:underline"
				>
					{row.original.website}
				</a>
			) : (
				<span className="text-sm text-muted-foreground">—</span>
			),
	},
	{
		accessorKey: "createdAt",
		header: "Added On",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
];
