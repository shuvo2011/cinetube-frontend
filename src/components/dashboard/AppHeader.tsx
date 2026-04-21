"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	// Find the most specific (longest) matching item so parent titles aren't chosen when a child route is active.
	const matches = allItems.filter(
		(item) => pathname === item.href || (item.href.length > 1 && pathname.startsWith(item.href + "/")),
	);
	if (matches.length > 0) {
		matches.sort((a, b) => b.href.length - a.href.length);
		const match = matches[0];
		const section = sections.find((s) => s.items.some((i) => i.href === match.href));
		return { title: match.title, sub: section?.title ?? "" };
	}
	return { title: "Dashboard", sub: "Overview" };
}

export default function AppHeader({ role, userName, userEmail, onMenuClick }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { title, sub } = getPageTitle(pathname, role);

	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	const profileHref = role === "ADMIN" ? "/admin/dashboard/profile" : "/dashboard/profile";
	const accentBg = role === "ADMIN" ? "bg-rose-50" : "bg-blue-50";
	const accentText = role === "ADMIN" ? "text-rose-600" : "text-blue-600";

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
			{/* Settings — hidden on mobile */}

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
