"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavSections, userNavSections } from "@/lib/dashboardNavItems";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../shared/Logo/Logo";
import { logout } from "@/services/auth.services";

type Props = {
	role: "ADMIN" | "USER";
	userName: string;
	userEmail: string;
	open: boolean;
	onClose: () => void;
};

export default function AppSidebar({ role, userName, userEmail, open, onClose }: Props) {
	const pathname = usePathname();
	const router = useRouter();

	const navSections = role === "ADMIN" ? adminNavSections : userNavSections;

	const allHrefs = navSections.flatMap((s) => s.items.map((i) => i.href));
	const activeHref = (() => {
		const matches = allHrefs.filter((h) => pathname === h || (h.length > 1 && pathname.startsWith(h + "/")));
		if (matches.length === 0) return null;
		matches.sort((a, b) => b.length - a.length);
		return matches[0];
	})();

	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleLogout = async () => {
		await logout();
		router.refresh();
		router.push("/login");
	};

	const accentBg = role === "ADMIN" ? "bg-rose-50" : "bg-blue-50";
	const accentText = role === "ADMIN" ? "text-rose-600" : "text-blue-600";
	const activeItemBg = role === "ADMIN" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600";
	const badgeColor = role === "ADMIN" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600";

	return (
		<>
			{open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}

			<aside
				className={cn(
					"fixed left-0 top-0 z-50 flex h-screen w-65 flex-col border-r border-gray-100 bg-white transition-transform duration-300",

					open ? "translate-x-0" : "-translate-x-full",

					"lg:translate-x-0",
				)}
			>
				<div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
					<Logo />
					<span
						className={cn("ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", badgeColor)}
					>
						{role === "ADMIN" ? "Admin" : "User"}
					</span>

					<button onClick={onClose} className="ml-1 rounded-lg p-1 hover:bg-gray-100 lg:hidden">
						<X className="h-4 w-4 text-gray-500" />
					</button>
				</div>

				<div className="border-b border-gray-100 px-5 py-4">
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold",
								accentBg,
								accentText,
							)}
						>
							{initials}
						</div>
						<div className="min-w-0">
							<p className="truncate text-[13px] font-bold text-gray-900">{userName}</p>
							<p className="truncate text-[11px] text-gray-400">{userEmail}</p>
						</div>
					</div>
				</div>

				<nav className="flex-1 overflow-y-auto px-3 py-3">
					{navSections.map((section) => (
						<div key={section.title} className="mb-2">
							<p className="mb-1 px-2.5 pt-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gray-400">
								{section.title}
							</p>
							{section.items.map((item) => {
								const isActive = activeHref === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={onClose}
										className={cn(
											"mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] transition-colors duration-150",
											isActive ? activeItemBg + " font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
										)}
									>
										<item.icon className={cn("h-4 w-4 shrink-0", isActive ? accentText : "text-gray-400")} />
										{item.title}
										{item.badge && (
											<span
												className={cn(
													"ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
													item.badgeVariant === "amber" ? "bg-amber-400" : "bg-rose-600",
												)}
											>
												{item.badge}
											</span>
										)}
									</Link>
								);
							})}
						</div>
					))}
				</nav>

				<div className="border-t border-gray-100 p-3">
					<Button
						variant="ghost"
						onClick={handleLogout}
						className="w-full justify-start gap-2.5 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</Button>
				</div>
			</aside>
		</>
	);
}
