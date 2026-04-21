"use client";

import DateCell from "@/components/shared/cell/DateCell";
import { IAdminUser } from "@/services/user.services";
import { ColumnDef } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const ROLE_STYLES: Record<string, string> = {
	SUPER_ADMIN: "bg-purple-50 text-purple-700",
	ADMIN: "bg-blue-50 text-blue-700",
	USER: "bg-gray-100 text-gray-600",
};

const STATUS_STYLES: Record<string, string> = {
	ACTIVE: "bg-green-50 text-green-700",
	BLOCKED: "bg-yellow-50 text-yellow-700",
	DELETED: "bg-red-50 text-red-600",
};

interface Options {
	currentRole: string;
	onStatusChange: (user: IAdminUser, status: string) => void;
	onRoleChange: (user: IAdminUser, role: string) => void;
	onDelete: (user: IAdminUser) => void;
	onHardDelete: (user: IAdminUser) => void;
}

export const adminUserColumns = ({
	currentRole,
	onStatusChange,
	onRoleChange,
	onDelete,
	onHardDelete,
}: Options): ColumnDef<IAdminUser>[] => [
	{
		accessorKey: "name",
		header: "User",
		cell: ({ row }) => {
			const { name, email, image } = row.original;
			const initials = name
				.split(" ")
				.map((n) => n[0])
				.slice(0, 2)
				.join("")
				.toUpperCase();
			return (
				<div className=" flex items-center gap-2.5">
					{image ? (
						// eslint-disable-next-line @next/next/no-img-element
						<div className="relative  w-8 h-8">
							<Image src={image} alt={name} fill className="rounded-full object-cover shrink-0" />
						</div>
					) : (
						<div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-bold shrink-0">
							{initials}
						</div>
					)}
					<div>
						<p className="text-[13px] font-medium text-ink">{name}</p>
						<p className="text-[11px] text-text-muted">{email}</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.original.role;
			return (
				<span
					className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-500"}`}
				>
					{role}
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = row.original.status;
			return (
				<span
					className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[s] ?? "bg-gray-100 text-gray-500"}`}
				>
					{s}
				</span>
			);
		},
	},
	{
		accessorKey: "emailVerified",
		header: "Verified",
		cell: ({ row }) => (
			<span
				className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${row.original.emailVerified ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
			>
				{row.original.emailVerified ? "Yes" : "No"}
			</span>
		),
	},
	{
		accessorKey: "subscriptionStatus",
		header: "Sub",
		cell: ({ row }) => {
			const sub = row.original.subscriptionStatus;
			return (
				<span
					className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sub === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
				>
					{sub}
				</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
	},
	{
		id: "actions",
		header: "Actions",
		enableSorting: false,
		cell: ({ row }) => {
			const user = row.original;
			const isSuperAdmin = user.role === "SUPER_ADMIN";

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
							<MoreHorizontal className="w-4 h-4 text-gray-500" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuLabel className="text-[11px] text-text-muted">Status</DropdownMenuLabel>
						{user.status !== "ACTIVE" && (
							<DropdownMenuItem
								disabled={isSuperAdmin}
								onClick={() => onStatusChange(user, "ACTIVE")}
								className="text-[12px] text-green-600 cursor-pointer"
							>
								Set Active
							</DropdownMenuItem>
						)}
						{user.status !== "BLOCKED" && (
							<DropdownMenuItem
								disabled={isSuperAdmin}
								onClick={() => onStatusChange(user, "BLOCKED")}
								className="text-[12px] text-yellow-600 cursor-pointer"
							>
								Block
							</DropdownMenuItem>
						)}

						{currentRole === "SUPER_ADMIN" && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuLabel className="text-[11px] text-text-muted">Role</DropdownMenuLabel>
								{user.role !== "USER" && (
									<DropdownMenuItem
										disabled={isSuperAdmin}
										onClick={() => onRoleChange(user, "USER")}
										className="text-[12px] cursor-pointer"
									>
										Set User
									</DropdownMenuItem>
								)}
								{user.role !== "ADMIN" && (
									<DropdownMenuItem
										disabled={isSuperAdmin}
										onClick={() => onRoleChange(user, "ADMIN")}
										className="text-[12px] cursor-pointer"
									>
										Set Admin
									</DropdownMenuItem>
								)}
							</>
						)}

						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={isSuperAdmin}
							onClick={() => onDelete(user)}
							className="text-[12px] text-red-500 cursor-pointer focus:text-red-600"
						>
							Soft Delete
						</DropdownMenuItem>
						{currentRole === "SUPER_ADMIN" && (
							<DropdownMenuItem
								disabled={isSuperAdmin}
								onClick={() => onHardDelete(user)}
								className="text-[12px] text-red-700 font-semibold cursor-pointer focus:text-red-800"
							>
								Hard Delete
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
