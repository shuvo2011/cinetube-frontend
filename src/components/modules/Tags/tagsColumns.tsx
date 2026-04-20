"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { ITag } from "@/types/tag.types";
import { ColumnDef } from "@tanstack/react-table";

export const tagsColumns: ColumnDef<ITag>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <span className="text-sm font-medium">{row.original.name}</span>,
	},
	{
		accessorKey: "createdAt",
		header: "Added On",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
];
