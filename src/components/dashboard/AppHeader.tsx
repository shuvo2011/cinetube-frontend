"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Settings, ChevronDown, User, LogOut, Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminNavSections, userNavSections } from "@/lib/dashboardNavItems";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { logout } from "@/services/auth.services";

type Props = {
	role: "ADMIN" | "USER";
	userName: string;
	userEmail: string;
	onMenuClick: () => void;
};

function getPageTitle(pathname: string, role: "ADMIN" | "USER"): { title: string; sub: string } {
	const sections = role === "ADMIN" ? adminNavSections : userNavSections;
	const allItems = sections.flatMap((s) => s.items);
	const match = allItems.find(
		(item) => pathname === item.href || (item.href.length > 1 && pathname.startsWith(item.href + "/")),
	);
	if (match) {
		const section = sections.find((s) => s.items.some((i) => i.href === match.href));
		return { title: match.title, sub: section?.title ?? "" };
	}
	return { title: "Dashboard", sub: "Overview" };
}

export default function AppHeader({ role, userName, userEmail, onMenuClick }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { title, sub } = getPageTitle(pathname, role);
	const [search, setSearch] = useState("");

	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	const profileHref = role === "ADMIN" ? "/admin/dashboard/profile" : "/dashboard/profile";
	const settingsHref = role === "ADMIN" ? "/admin/dashboard/settings" : "/dashboard/settings";
	const accentBg = role === "ADMIN" ? "bg-rose-50" : "bg-blue-50";
	const accentText = role === "ADMIN" ? "text-rose-600" : "text-blue-600";
	const dotColor = role === "ADMIN" ? "bg-rose-600" : "bg-blue-600";

	const handleLogout = async () => {
		await logout();
		router.refresh();
		router.push("/login");
	};

	return (
		<header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-gray-100 bg-white px-4 lg:px-7">
			{/* Hamburger — mobile only */}
			<button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
				<Menu className="h-5 w-5 text-gray-600" />
			</button>

			{/* Page title */}
			<div className="mr-auto">
				<h1 className="text-[15px] font-extrabold tracking-tight text-gray-900">
					{title}
					<span className="ml-2 hidden text-[13px] font-normal text-gray-400 sm:inline">{sub}</span>
				</h1>
			</div>

			{/* Search — hidden on small screens */}
			<div className="relative hidden md:block">
				<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..."
					className="h-9 w-44 rounded-lg border-gray-200 bg-gray-50 pl-9 text-[13px] lg:w-56"
				/>
			</div>

			{/* Notification */}
			<div className="relative">
				<Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100">
					<Bell className="h-4 w-4 text-gray-500" />
				</Button>
				<span className={cn("absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white", dotColor)} />
			</div>

			{/* Settings — hidden on mobile */}
			<Button
				variant="ghost"
				size="icon"
				className="hidden h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 sm:flex"
				asChild
			>
				<Link href={settingsHref}>
					<Settings className="h-4 w-4 text-gray-500" />
				</Link>
			</Button>

			{/* Profile dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
						<div
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold",
								accentBg,
								accentText,
							)}
						>
							{initials}
						</div>
						<div className="hidden flex-col items-start md:flex">
							<span className="text-[12px] font-bold leading-tight text-gray-900">{userName}</span>
							<span className="text-[10px] leading-tight text-gray-400">{userEmail}</span>
						</div>
						<ChevronDown className="h-3.5 w-3.5 text-gray-400" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel className="text-[12px] text-gray-500">My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={profileHref} className="flex cursor-pointer items-center gap-2 text-[13px]">
							<User className="h-4 w-4" />
							My Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={settingsHref} className="flex cursor-pointer items-center gap-2 text-[13px]">
							<Settings className="h-4 w-4" />
							Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={handleLogout}
						className="flex cursor-pointer items-center gap-2 text-[13px] text-red-500 focus:text-red-600"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
