"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { ICastMember } from "@/types/castMember.types";
import { ColumnDef } from "@tanstack/react-table";

export const castMembersColumns: ColumnDef<ICastMember>[] = [
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
