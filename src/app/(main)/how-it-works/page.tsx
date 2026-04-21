import Link from "next/link";
import { UserPlus, Search, Star, PlayCircle, BookmarkPlus, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "How It Works - CineTube",
	description:
		"Learn how CineTube works — browse movies, write reviews, stream premium content and manage your watchlist.",
};

const steps = [
	{
		number: "01",
		icon: UserPlus,
		title: "Create a Free Account",
		description:
			"Sign up in seconds with your email. No credit card required. Your free account gives you full access to browse and review.",
		color: "bg-[#FEF2F2]",
		iconColor: "text-[#EF4C5C]",
		iconBg: "bg-[#FDE7EA]",
	},
	{
		number: "02",
		icon: Search,
		title: "Browse & Discover",
		description:
			"Explore thousands of movies and series. Filter by genre, year, rating, or platform. Find your next favourite title instantly.",
		color: "bg-[#FDF1D5]",
		iconColor: "text-[#D97706]",
		iconBg: "bg-[#FEF3C7]",
	},
	{
		number: "03",
		icon: Star,
		title: "Rate & Review",
		description:
			"Give a score from 1–10 and write your honest review. Tag spoilers, add genres, and help 200K+ fellow cinephiles decide what to watch.",
		color: "bg-[#DDF4E5]",
		iconColor: "text-[#16A34A]",
		iconBg: "bg-[#DCFCE7]",
	},
	{
		number: "04",
		icon: PlayCircle,
		title: "Stream Premium Content",
		description: "Upgrade to a Monthly or Yearly plan to unlock HD and 4K streaming across all your devices, ad-free.",
		color: "bg-[#E2E1FB]",
		iconColor: "text-[#6D28D9]",
		iconBg: "bg-[#EDE9FE]",
	},
	{
		number: "05",
		icon: BookmarkPlus,
		title: "Build Your Watchlist",
		description:
			"Save titles with one click. Track what you've watched, what's up next, and get personalised recommendations based on your taste.",
		color: "bg-[#DBEAFE]",
		iconColor: "text-[#1D4ED8]",
		iconBg: "bg-[#DBEAFE]",
	},
	{
		number: "06",
		icon: ShieldCheck,
		title: "Trusted & Safe",
		description:
			"All reviews are moderated. Spam and spoilers are handled automatically so you always get clean, honest community feedback.",
		color: "bg-[#FCE7F3]",
		iconColor: "text-[#BE185D]",
		iconBg: "bg-[#FCE7F3]",
	},
];

const faqs = [
	{
		q: "Is CineTube free to use?",
		a: "Yes. Browsing, searching and writing reviews are completely free. Streaming premium content requires a paid plan starting at $9.99/month.",
	},
	{
		q: "Can I cancel my subscription anytime?",
		a: "Absolutely. Monthly subscribers can cancel anytime with no penalty. Yearly plans can be cancelled before the next renewal.",
	},
	{
		q: "How are review ratings calculated?",
		a: "Each movie's score is the weighted average of all approved community reviews. Newer reviews carry slightly more weight to reflect current sentiment.",
	},
	{
		q: "What devices can I stream on?",
		a: "CineTube works on any modern browser — desktop, tablet, or mobile. Monthly plans support 2 simultaneous devices; Yearly plans support 4.",
	},
	{
		q: "How do I report an inappropriate review?",
		a: "Every review has a 'Report' button. Our moderation team reviews all reports within 24 hours and takes action accordingly.",
	},
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const HowItWorksPage = () => {
	return (
		<div className="bg-white min-h-screen">
			{/* ── Hero ── */}
			<section className="bg-[#FEF2F2] py-20 relative overflow-hidden">
				{/* decorative circles */}
				<div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />
				<div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />

				<div className="max-w-[1280px] mx-auto px-10 relative z-10 text-center">
					{/* eyebrow */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-5">
						<span className="w-1.5 h-1.5 rounded-full bg-[#EF4C5C]" />
						Simple, Powerful, Free
					</div>

					<h1 className="text-[56px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-[1.02] mb-6">
						How <em className="not-italic text-[#EF4C5C]">CineTube</em> Works
					</h1>

					<p className="text-[17px] text-[#6B6B73] max-w-xl mx-auto mb-10 leading-relaxed">
						From discovering your next favourite film to writing a review that helps thousands — here&apos;s everything
						you can do on CineTube.
					</p>

					<div className="flex gap-3 justify-center flex-wrap">
						<Button
							asChild
							size="lg"
							className="bg-[#EF4C5C] hover:bg-[#DC3545] text-white rounded-[10px] px-6 font-semibold"
						>
							<Link href="/register">
								Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="rounded-[10px] px-6 font-semibold border-[#EAEAEE] text-[#0F0F10]"
						>
							<Link href="/movies">Browse Movies</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ── Steps ── */}
			<section className="py-20">
				<div className="max-w-[1280px] mx-auto px-10">
					{/* Section header */}
					<div className="flex justify-between items-end mb-12">
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">STEP BY STEP</p>
							<h2 className="text-[42px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] max-w-lg">
								Everything You Need In One Platform
							</h2>
						</div>
						<p className="text-[15px] text-[#6B6B73] max-w-xs text-right">
							Six simple steps to get the most out of CineTube.
						</p>
					</div>

					{/* Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{steps.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.number}
									className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-8 flex flex-col gap-4 hover:shadow-[0_4px_16px_rgba(15,15,16,0.06)] transition-shadow"
								>
									<div className="flex items-center justify-between">
										<div
											className={`w-12 h-12 rounded-[12px] ${step.iconBg} ${step.iconColor} flex items-center justify-center`}
										>
											<Icon className="w-5 h-5" />
										</div>
										<span className="text-[28px] font-black tracking-tight text-[#EAEAEE]">{step.number}</span>
									</div>
									<h3 className="text-[19px] font-bold text-[#0F0F10] tracking-[-0.01em]">{step.title}</h3>
									<p className="text-[14px] text-[#6B6B73] leading-[1.6]">{step.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ── Why CineTube ── */}
			<section className="py-20 bg-[#FAFAFA]">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Left: text */}
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">WHY CINETUBE</p>
							<h2 className="text-[38px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] mb-5">
								The Only Platform Built for Real Cinephiles
							</h2>
							<p className="text-[15px] text-[#6B6B73] leading-relaxed mb-8">
								We built CineTube because other platforms either focus only on streaming or only on reviews. CineTube
								does both — and does them better.
							</p>

							<ul className="flex flex-col gap-4">
								{[
									"No algorithm-driven recommendations — just honest community scores",
									"Moderated reviews so you never see spam or fake ratings",
									"Premium streaming without the bloated subscription costs",
									"Works on every device — no app download required",
								].map((item) => (
									<li key={item} className="flex items-start gap-3 text-[14px] text-[#2B2B30]">
										<CheckCircle2 className="w-5 h-5 text-[#EF4C5C] flex-shrink-0 mt-0.5" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{/* Right: stats */}
						<div className="grid grid-cols-2 gap-4">
							{[
								{ n: "12K+", l: "Movies & Series", bg: "bg-[#FEF2F2]", nc: "text-[#EF4C5C]" },
								{ n: "85K+", l: "Community Reviews", bg: "bg-[#FDF1D5]", nc: "text-[#D97706]" },
								{ n: "4.8★", l: "Average Rating", bg: "bg-[#DDF4E5]", nc: "text-[#16A34A]" },
								{ n: "200K+", l: "Active Members", bg: "bg-[#E2E1FB]", nc: "text-[#6D28D9]" },
							].map((stat) => (
								<div key={stat.l} className={`${stat.bg} rounded-[18px] p-7 flex flex-col gap-1`}>
									<span className={`text-[36px] font-black tracking-tight leading-none ${stat.nc}`}>{stat.n}</span>
									<span className="text-[13px] text-[#6B6B73] font-medium">{stat.l}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── FAQ ── */}
			<section className="py-20">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="flex justify-between items-end mb-12">
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">FAQ</p>
							<h2 className="text-[38px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05]">
								Frequently Asked Questions
							</h2>
						</div>
						<p className="text-[15px] text-[#6B6B73] max-w-xs text-right">
							Still have questions?{" "}
							<Link href="/contact" className="text-[#EF4C5C] font-semibold hover:underline">
								Contact us →
							</Link>
						</p>
					</div>

					<div className="flex flex-col gap-3 max-w-3xl">
						{faqs.map((faq) => (
							<div key={faq.q} className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[14px] p-6">
								<h3 className="text-[16px] font-bold text-[#0F0F10] mb-2">{faq.q}</h3>
								<p className="text-[14px] text-[#6B6B73] leading-relaxed">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="bg-[#EF4C5C] py-20">
				<div className="max-w-[1280px] mx-auto px-10 text-center">
					<h2 className="text-[38px] font-extrabold tracking-tight text-white mb-4">Start Watching Today</h2>
					<p className="text-white/70 text-[16px] mb-10 max-w-md mx-auto">
						Join 200,000+ movie lovers already on CineTube. Create your free account in seconds.
					</p>
					<div className="flex gap-3 justify-center flex-wrap">
						<Button
							asChild
							size="lg"
							className="bg-white text-[#EF4C5C] hover:bg-[#FAFAFA] rounded-[10px] px-6 font-semibold"
						>
							<Link href="/register">Create Free Account</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="border-white/40 text-white bg-transparent hover:bg-white/10 rounded-[10px] px-6 font-semibold"
						>
							<Link href="/movies">Browse Movies</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HowItWorksPage;
