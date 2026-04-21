import Link from "next/link";
import { ArrowRight, Users, Film, Star, ShieldCheck, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "About Us",
	description: "Learn about CineTube — who we are, what drives us, and the team behind the platform.",
};
const values = [
	{
		icon: ShieldCheck,
		title: "Honest Reviews",
		desc: "Every review is moderated. No fake ratings, no spam — just real opinions from real cinephiles.",
		bg: "bg-[#FEF2F2]",
		iconBg: "bg-[#FDE7EA]",
		iconColor: "text-[#EF4C5C]",
	},
	{
		icon: Zap,
		title: "Built for Speed",
		desc: "Fast search, instant ratings, and a seamless streaming experience across every device.",
		bg: "bg-[#FDF1D5]",
		iconBg: "bg-[#FEF3C7]",
		iconColor: "text-[#D97706]",
	},
	{
		icon: Heart,
		title: "Community First",
		desc: "200K+ members shape the platform. Feature requests, feedback, and ideas come directly from our users.",
		bg: "bg-[#DDF4E5]",
		iconBg: "bg-[#DCFCE7]",
		iconColor: "text-[#16A34A]",
	},
];

const team = [
	{
		name: "Sarah Chen",
		role: "Co-founder & CEO",
		initials: "SC",
		color: "bg-[#FEF2F2] text-[#EF4C5C]",
	},
	{
		name: "Marcus Reid",
		role: "Co-founder & CTO",
		initials: "MR",
		color: "bg-[#FDF1D5] text-[#D97706]",
	},
	{
		name: "Priya Nair",
		role: "Head of Product",
		initials: "PN",
		color: "bg-[#DDF4E5] text-[#16A34A]",
	},
	{
		name: "James Owusu",
		role: "Lead Engineer",
		initials: "JO",
		color: "bg-[#E2E1FB] text-[#6D28D9]",
	},
];

const AboutPage = () => {
	return (
		<div className="bg-white min-h-screen">
			<section className="bg-[#FEF2F2] py-24 relative overflow-hidden">
				<div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />
				<div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />

				<div className="max-w-[1280px] mx-auto px-10 relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-6">
								<span className="w-1.5 h-1.5 rounded-full bg-[#EF4C5C]" />
								Our Story
							</div>
							<h1 className="text-[52px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-[1.02] mb-6">
								We Built CineTube <br />
								for <span className="text-[#EF4C5C]">Real Cinephiles</span>
							</h1>
							<p className="text-[16px] text-[#6B6B73] leading-relaxed mb-6 max-w-lg">
								CineTube was founded in 2023 by a small team of film obsessives who were tired of scattered reviews,
								bloated streaming apps, and algorithm-driven recommendations that never felt personal.
							</p>
							<p className="text-[16px] text-[#6B6B73] leading-relaxed mb-10 max-w-lg">
								We built one platform that does it all — browse, rate, review, and stream — with honesty and community
								at its core.
							</p>
							<Button
								asChild
								size="lg"
								className="bg-[#EF4C5C] hover:bg-[#DC3545] text-white rounded-[10px] px-6 font-semibold"
							>
								<Link href="/movies">
									Explore Movies <ArrowRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-4">
							{[
								{ icon: Film, n: "12K+", l: "Movies & Series", bg: "bg-white", nc: "text-[#EF4C5C]" },
								{ icon: Star, n: "85K+", l: "Community Reviews", bg: "bg-white", nc: "text-[#D97706]" },
								{ icon: Users, n: "200K+", l: "Active Members", bg: "bg-white", nc: "text-[#16A34A]" },
								{ icon: ShieldCheck, n: "4.8★", l: "Average Rating", bg: "bg-white", nc: "text-[#6D28D9]" },
							].map((s) => {
								const Icon = s.icon;
								return (
									<div
										key={s.l}
										className={`${s.bg} rounded-[18px] border border-[#F2F2F5] shadow-sm p-7 flex flex-col gap-3`}
									>
										<Icon className={`w-6 h-6 ${s.nc}`} />
										<span className={`text-[36px] font-black tracking-tight leading-none ${s.nc}`}>{s.n}</span>
										<span className="text-[13px] text-[#6B6B73] font-medium">{s.l}</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 bg-[#FAFAFA]">
				<div className="max-w-7xl mx-auto px-10">
					<div className="flex justify-between items-end mb-14">
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">WHAT WE STAND FOR</p>
							<h2 className="text-[40px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] max-w-md">
								The Values That Drive Us
							</h2>
						</div>
						<p className="text-[15px] text-[#6B6B73] max-w-xs text-right">
							Three principles that guide every decision we make at CineTube.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{values.map((v) => {
							const Icon = v.icon;
							return (
								<div
									key={v.title}
									className="bg-white border border-[#F2F2F5] rounded-[18px] p-8 flex flex-col gap-4 hover:shadow-[0_4px_16px_rgba(15,15,16,0.06)] transition-shadow"
								>
									<div
										className={`w-12 h-12 rounded-[12px] ${v.iconBg} ${v.iconColor} flex items-center justify-center`}
									>
										<Icon className="w-5 h-5" />
									</div>
									<h3 className="text-[19px] font-bold text-[#0F0F10] tracking-[-0.01em]">{v.title}</h3>
									<p className="text-[14px] text-[#6B6B73] leading-[1.6]">{v.desc}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="py-24">
				<div className="max-w-7xl mx-auto px-10">
					<div className="text-center mb-14">
						<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">THE PEOPLE</p>
						<h2 className="text-[40px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] mb-4">
							Meet the Team
						</h2>
						<p className="text-[15px] text-[#6B6B73] max-w-sm mx-auto">
							A small, passionate team that lives and breathes movies.
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
						{team.map((member) => (
							<div
								key={member.name}
								className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-7 flex flex-col items-center text-center gap-4"
							>
								<div
									className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center text-[20px] font-black`}
								>
									{member.initials}
								</div>
								<div>
									<p className="text-[15px] font-bold text-[#0F0F10]">{member.name}</p>
									<p className="text-[13px] text-[#6B6B73] mt-0.5">{member.role}</p>
								</div>
							</div>
						))}
					</div>

					<div className="bg-[#EF4C5C] rounded-[24px] px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
						<div>
							<h3 className="text-[30px] font-extrabold text-white tracking-tight mb-2">Join 200,000+ Cinephiles</h3>
							<p className="text-white/70 text-[15px] max-w-sm">
								Create a free account and start rating, reviewing, and streaming today.
							</p>
						</div>
						<div className="flex gap-3 flex-shrink-0">
							<Button
								asChild
								size="lg"
								className="bg-white text-[#EF4C5C] hover:bg-[#FAFAFA] rounded-[10px] px-6 font-semibold"
							>
								<Link href="/register">Get Started Free</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-white/40 text-white bg-transparent hover:bg-white/10 rounded-[10px] px-6 font-semibold"
							>
								<Link href="/contact">Contact Us</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AboutPage;
