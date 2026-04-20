"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
	meta: {
		page: number;
		totalPages: number;
		total: number;
	};
}

const MoviesPagination = ({ meta }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPage = meta.page;
	const totalPages = meta.totalPages;

	const goToPage = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));
		router.push(`/movies?${params.toString()}`);
	};

	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
			pages.push(i);
		}
	}

	// ellipsis যোগ করো
	const pagesWithEllipsis: (number | "...")[] = [];
	let prev = 0;
	for (const page of pages) {
		if (prev && page - prev > 1) pagesWithEllipsis.push("...");
		pagesWithEllipsis.push(page);
		prev = page;
	}

	return (
		<div className="flex items-center justify-center gap-2 mt-10">
			<button
				onClick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				className="w-9 h-9 rounded-[8px] border border-line flex items-center justify-center text-[13px] text-text-muted hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				←
			</button>

			{pagesWithEllipsis.map((page, i) =>
				page === "..." ? (
					<span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[13px] text-text-muted">
						...
					</span>
				) : (
					<button
						key={page}
						onClick={() => goToPage(page)}
						className={cn(
							"w-9 h-9 rounded-[8px] border text-[13px] font-medium transition-colors",
							currentPage === page
								? "bg-brand text-white border-brand"
								: "border-line text-text-muted hover:border-brand hover:text-brand",
						)}
					>
						{page}
					</button>
				),
			)}

			<button
				onClick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="w-9 h-9 rounded-[8px] border border-line flex items-center justify-center text-[13px] text-text-muted hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				→
			</button>
		</div>
	);
};

export default MoviesPagination;
