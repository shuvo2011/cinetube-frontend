import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Home, Search, ArrowLeft } from "lucide-react";

export const metadata = {
	title: "Movie Not Found - CineTube",
	description: "The movie you're looking for isn't available. Explore other trending titles on CineTube.",
};

export default function MovieNotFound() {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
			{/* Icon */}
			<div className="relative mb-6">
				<div className="w-24 h-24 rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center bg-background">
					<div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive flex items-center justify-center">
						<Film className="w-5 h-5 text-destructive" />
					</div>
				</div>
				<span className="absolute -bottom-1 -right-1 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
					404
				</span>
			</div>

			{/* Text */}
			<h1 className="text-3xl font-bold text-foreground mb-2">Movie Not Found</h1>
			<p className="text-sm text-muted-foreground text-center max-w-md mb-8">
				This movie might have been removed, never existed, or you followed a broken link.
			</p>

			{/* Actions */}
			<div className="flex gap-3 flex-wrap justify-center">
				<Button variant="outline" asChild>
					<Link href="/movies">
						<Search className="w-4 h-4 mr-2" />
						Browse Movies
					</Link>
				</Button>

				<Button asChild>
					<Link href="/">
						<Home className="w-4 h-4 mr-2" />
						Go Home
					</Link>
				</Button>

				<Button variant="ghost" asChild>
					<Link href="/movies">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Link>
				</Button>
			</div>
		</div>
	);
}
