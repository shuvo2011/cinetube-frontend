"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface MoviesHeroProps {
	total: number;
}

const MoviesHero = ({ total }: MoviesHeroProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("searchTerm") ?? "");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		if (search.trim()) {
			params.set("searchTerm", search.trim());
		} else {
			params.delete("searchTerm");
		}
		params.delete("page");
		router.push(`/movies?${params.toString()}`);
	};

	return (
		<section className="bg-cream py-11 pb-12">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				<p className="text-[12px] font-bold text-brand tracking-[0.12em] uppercase mb-2.5">Browse</p>
				<div className="flex items-end justify-between gap-6 mb-7">
					<h1 className="text-[44px] font-black tracking-[-0.025em] text-ink leading-[1.05]">
						All Movies &amp; Series
					</h1>
					<span className="text-[15px] text-text-muted whitespace-nowrap">
						Showing <strong className="text-ink font-bold">{total}</strong> titles
					</span>
				</div>

				<form
					onSubmit={handleSearch}
					className="flex items-center gap-2.5 bg-white pl-5 pr-1.5 py-1.5 rounded-[14px] shadow-[0_2px_8px_rgba(15,15,16,0.04)]"
				>
					<Search size={18} className="text-text-subtle shrink-0" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by title, genre, director, cast, or streaming platform..."
						className="flex-1 border-none outline-none bg-transparent py-3.5 text-[15px] text-ink placeholder:text-text-subtle"
					/>
					<button
						type="submit"
						className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-7 py-3 rounded-[10px] transition-colors shrink-0"
					>
						Search
					</button>
				</form>
			</div>
		</section>
	);
};

export default MoviesHero;
