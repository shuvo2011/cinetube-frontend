// Navbar.tsx
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo/Logo";
import { logout } from "@/services/auth.services";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Movies", href: "/movies" },
];

interface NavbarProps {
	userInfo?: {
		name: string;
		role: string;
		image?: string | null;
	} | null;
}

const Navbar = ({ userInfo }: NavbarProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [mobileOpen, setMobileOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dashboardRoute =
		userInfo?.role === "ADMIN" || userInfo?.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/dashboard";

	const profileRoute =
		userInfo?.role === "ADMIN" || userInfo?.role === "SUPER_ADMIN" ? "/admin/dashboard/profile" : "/dashboard/profile";

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/movies?searchTerm=${encodeURIComponent(searchQuery.trim())}`);
			setSearchOpen(false);
			setSearchQuery("");
		}
	};
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const allLinks = [...navLinks, ...(userInfo ? [{ label: "Dashboard", href: dashboardRoute }] : [])];

	const handleLogout = async () => {
		await logout();
		router.push("/login");
		router.refresh();
	};

	return (
		<>
			<header className="sticky top-0 z-9999 bg-bg">
				<div className="max-w-350 mx-auto px-6 md:px-10 flex items-center justify-between h-18">
					{/* Logo */}
					<Logo />

					{/* Desktop Nav */}
					<nav className="hidden lg:flex items-center gap-9 flex-1 justify-center">
						{allLinks.map((link) => {
							const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"relative py-1 text-[15px] transition-colors",
										isActive ? "font-semibold text-ink" : "font-medium text-text-base hover:text-ink",
									)}
								>
									{link.label}
									{isActive && <span className="absolute left-0 right-0 -bottom-1.5 h-0.5 bg-brand rounded-full" />}
								</Link>
							);
						})}
					</nav>

					{/* Right */}
					<div className="flex items-center gap-2 md:gap-3 shrink-0">
						{/* Search Trigger — desktop only */}
						<div
							onClick={() => setSearchOpen(true)}
							className="hidden md:flex items-center gap-2 bg-line-2 rounded-full px-4 py-2 w-55 text-text-subtle text-sm cursor-pointer hover:bg-line transition-colors"
						>
							<Search size={14} />
							<span>Search movies...</span>
						</div>

						{/* Search icon — mobile */}
						<button
							className="md:hidden p-2 text-text-muted hover:text-ink transition-colors"
							onClick={() => setSearchOpen(true)}
						>
							<Search size={18} />
						</button>

						{userInfo ? (
							<div className="relative" ref={dropdownRef}>
								<div
									onClick={() => setDropdownOpen((v) => !v)}
									className="w-8.5 h-8.5 rounded-full bg-brand-soft border-[1.5px] border-brand flex items-center justify-center overflow-hidden cursor-pointer hover:bg-brand-softer transition-colors"
								>
									{userInfo.image ? (
										<Image src={userInfo.image} alt={userInfo.name} width={34} height={34} className="object-cover" />
									) : (
										<span className="text-sm font-bold text-brand">{userInfo.name.charAt(0).toUpperCase()}</span>
									)}
								</div>

								{dropdownOpen && (
									<div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-[12px] border border-line-2 shadow-[0_8px_30px_rgba(15,15,16,0.10)] py-1.5 z-50">
										{/* User info */}
										<div className="px-4 py-3 border-b border-line-2">
											<p className="text-[13px] font-semibold text-ink truncate">{userInfo.name}</p>
											<p className="text-[11px] text-text-muted capitalize">{userInfo.role.toLowerCase()}</p>
										</div>
										{/* Links */}
										<div className="py-1">
											<Link
												href={dashboardRoute}
												onClick={() => setDropdownOpen(false)}
												className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-text-base hover:bg-line-2 hover:text-ink transition-colors"
											>
												Dashboard
											</Link>
											<Link
												href={profileRoute}
												onClick={() => setDropdownOpen(false)}
												className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-text-base hover:bg-line-2 hover:text-ink transition-colors"
											>
												Profile
											</Link>
										</div>
										{/* Logout */}
										<div className="border-t border-line-2 py-1">
											<button
												onClick={() => handleLogout()}
												className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
											>
												Logout
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Link
									href="/login"
									className="hidden sm:block text-sm font-semibold text-ink px-3 py-2 hover:text-brand transition-colors"
								>
									Login
								</Link>
								<Link
									href="/register"
									className="text-sm font-semibold text-white bg-brand hover:bg-brand-hover transition-colors px-4 py-2 rounded-[10px]"
								>
									Sign Up
								</Link>
							</>
						)}

						{/* Mobile Menu Button */}
						<button
							className="md:hidden p-2 text-text-muted hover:text-ink transition-colors"
							onClick={() => setMobileOpen((v) => !v)}
						>
							{mobileOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileOpen && (
					<div className="lg:hidden border-t border-line-2 bg-bg px-6 py-3 space-y-1">
						{allLinks.map((link) => {
							const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className={cn(
										"flex px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
										isActive ? "bg-brand-soft text-brand" : "text-text-base hover:bg-line-2 hover:text-ink",
									)}
								>
									{link.label}
								</Link>
							);
						})}
						{!userInfo && (
							<Link
								href="/login"
								onClick={() => setMobileOpen(false)}
								className="flex px-3 py-2.5 text-sm font-medium rounded-lg text-text-base hover:bg-line-2 hover:text-ink transition-colors"
							>
								Login
							</Link>
						)}
					</div>
				)}
			</header>

			{/* Search Dialog */}
			<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
				<DialogContent className="fixed top-20 left-1/2 -translate-x-1/2 translate-y-0 max-w-xl w-[calc(100%-2rem)] p-0 gap-0 rounded-[14px] border-line shadow-[0_12px_40px_rgba(15,15,16,0.12)]">
					<DialogTitle className="sr-only">Search</DialogTitle>
					<form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-3.5">
						<Search size={16} className="text-text-subtle shrink-0" />
						<input
							ref={inputRef}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search movies, genres, directors..."
							className="flex-1 border-none outline-none text-[15px] text-ink bg-transparent placeholder:text-text-subtle"
							autoFocus
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="w-5 h-5 rounded-full bg-line-2 flex items-center justify-center shrink-0 hover:bg-line transition-colors"
							>
								<X size={11} className="text-text-muted" />
							</button>
						)}
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Navbar;
