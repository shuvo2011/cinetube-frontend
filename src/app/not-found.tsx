// app/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Home, Search, Star, Calendar, User, LayoutDashboard } from "lucide-react";
export const metadata = {
	title: "404 - Lost in Streaming",
	description:
		"This page seems to have faded to black. The movie, series, or review you're searching for isn't available. Discover what's trending now on CineTube.",
};
export default function NotFound() {
	return (
		<div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center px-4 py-20">
			{/* Film reel icon */}
			<div className="relative mb-8">
				<div className="w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-background shadow-sm">
					<div className="w-14 h-14 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center">
						<Film className="w-6 h-6 text-destructive" />
					</div>
				</div>
				<span className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
					404
				</span>
			</div>

			{/* Error code */}
			<h1 className="text-[96px] font-black leading-none tracking-tighter text-muted-foreground/20 mb-2 select-none">
				4<span className="text-destructive">0</span>4
			</h1>

			{/* Title & description */}
			<h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">Page Not Found</h2>
			<p className="text-muted-foreground text-center max-w-sm mb-10 leading-relaxed">
				Looks like this scene got cut from the final edit. The page you&apos;re looking for doesn&apos;t exist or has
				been moved.
			</p>

			{/* CTA buttons */}
			<div className="flex gap-3 flex-wrap justify-center mb-12">
				<Button asChild>
					<Link href="/">
						<Home className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/movies">
						<Search className="w-4 h-4 mr-2" />
						Browse Movies
					</Link>
				</Button>
			</div>
		</div>
	);
}
