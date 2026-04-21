"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IAdminPayment } from "@/services/payment.services";
import { ColumnDef } from "@tanstack/react-table";

const STATUS_STYLES: Record<string, string> = {
	COMPLETED: "bg-green-50 text-green-700",
	PENDING: "bg-yellow-50 text-yellow-700",
	FAILED: "bg-red-50 text-red-600",
	REFUNDED: "bg-gray-100 text-gray-600",
};

const PURCHASE_STYLES: Record<string, string> = {
	SUBSCRIPTION: "bg-purple-50 text-purple-700",
	BUY: "bg-blue-50 text-blue-700",
	RENT: "bg-orange-50 text-orange-700",
};

export const adminPaymentColumns: ColumnDef<IAdminPayment>[] = [
	{
		accessorKey: "user",
		header: "User",
		cell: ({ row }) => {
			const { name, email } = row.original.user;
			const initials = name
				.split(" ")
				.map((n) => n[0])
				.slice(0, 2)
				.join("")
				.toUpperCase();
			return (
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-bold shrink-0">
						{initials}
					</div>
					<div>
						<p className="text-[13px] font-medium text-ink">{name}</p>
						<p className="text-[11px] text-text-muted">{email}</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "movie",
		header: "Movie",
		cell: ({ row }) => {
			const movie = row.original.movie;
			return movie ? (
				<span className="text-[13px] text-ink">{movie.title}</span>
			) : (
				<span className="text-[11px] text-text-muted">—</span>
			);
		},
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const { amount, currency } = row.original;
			return (
				<span className="text-[13px] font-medium text-ink">
					{amount.toLocaleString()} {currency}
				</span>
			);
		},
	},
	{
		accessorKey: "purchaseType",
		header: "Type",
		cell: ({ row }) => {
			const type = row.original.purchaseType;
			return (
				<span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PURCHASE_STYLES[type] ?? "bg-gray-100 text-gray-500"}`}>
					{type}
				</span>
			);
		},
	},
	{
		accessorKey: "planType",
		header: "Plan",
		cell: ({ row }) => {
			const plan = row.original.planType;
			return plan ? (
				<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
					{plan}
				</span>
			) : (
				<span className="text-[11px] text-text-muted">—</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = row.original.status;
			return (
				<span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[s] ?? "bg-gray-100 text-gray-500"}`}>
					{s}
				</span>
			);
		},
	},
	{
		accessorKey: "gateway",
		header: "Gateway",
		cell: ({ row }) => (
			<span className="text-[12px] text-text-muted">{row.original.gateway}</span>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
];
