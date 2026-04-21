import Link from "next/link";

const CTASection = () => {
	return (
		<section className="bg-ink py-16 md:py-20">
			<div className="max-w-350 mx-auto px-6 md:px-10 text-center">
				<h2 className="text-[36px] md:text-[48px] font-black text-white tracking-tight mb-4">Start Watching Today</h2>
				<p className="text-[15px] text-white/50 mb-8 max-w-md mx-auto">
					Join 200,000+ movie lovers already on CineTube. Create your free account in seconds.
				</p>
				<div className="flex items-center justify-center gap-3">
					<Link
						href="/register"
						className="text-sm font-semibold text-ink bg-white hover:bg-line-2 transition-colors px-6 py-3 rounded-[10px]"
					>
						Create Free Account
					</Link>
					<Link
						href="/movies"
						className="text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors px-6 py-3 rounded-[10px]"
					>
						Browse Movies
					</Link>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
