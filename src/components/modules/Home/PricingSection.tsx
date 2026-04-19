import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
	{
		name: "FREE",
		price: "৳0",
		period: "Forever free",
		features: [
			{ label: "Browse all movies", included: true },
			{ label: "Write reviews", included: true },
			{ label: "Stream content", included: false },
			{ label: "Offline downloads", included: false },
		],
		cta: "Get Started",
		href: "/register",
		highlighted: false,
	},
	{
		name: "MONTHLY",
		price: "৳299",
		period: "Per month, cancel anytime",
		features: [
			{ label: "Everything in Free", included: true },
			{ label: "Stream all content", included: true },
			{ label: "HD quality · 2 devices", included: true },
			{ label: "Ad-free experience", included: true },
		],
		cta: "Subscribe Now",
		href: "/register",
		highlighted: true,
		badge: "MOST POPULAR",
	},
	{
		name: "YEARLY",
		price: "৳2,499",
		period: "Per year · Save 30%",
		features: [
			{ label: "Everything in Monthly", included: true },
			{ label: "4K + HDR quality", included: true },
			{ label: "4 devices", included: true },
			{ label: "Offline downloads", included: true },
		],
		cta: "Subscribe Yearly",
		href: "/register",
		highlighted: false,
	},
];

const PricingSection = () => {
	return (
		<section className="py-16 md:py-20 bg-bg-2">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
					<div>
						<p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase mb-3">Simple Pricing</p>
						<h2 className="text-[36px] md:text-[42px] font-black tracking-tight text-ink leading-[1.05]">
							Choose Your Plan
						</h2>
					</div>
					<p className="text-[15px] text-text-muted md:text-right leading-relaxed">
						Start free and upgrade anytime. No hidden fees.
					</p>
				</div>

				{/* Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative rounded-[20px] p-8 flex flex-col ${
								plan.highlighted ? "bg-ink text-white" : "bg-bg border border-line-2"
							}`}
						>
							{/* Badge */}
							{plan.badge && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<span className="bg-brand text-white text-[11px] font-bold tracking-widest px-4 py-1.5 rounded-full">
										{plan.badge}
									</span>
								</div>
							)}

							{/* Plan name */}
							<p
								className={`text-[11px] font-bold tracking-[0.15em] mb-4 ${
									plan.highlighted ? "text-white/50" : "text-text-subtle"
								}`}
							>
								{plan.name}
							</p>

							{/* Price */}
							<div className="mb-1">
								<span
									className={`text-[52px] font-black tracking-tight leading-none ${
										plan.highlighted ? "text-white" : "text-ink"
									}`}
								>
									{plan.price}
								</span>
							</div>
							<p className={`text-sm mb-8 ${plan.highlighted ? "text-white/50" : "text-text-muted"}`}>{plan.period}</p>

							{/* Features */}
							<ul className="flex-1 space-y-4 mb-8">
								{plan.features.map((feature) => (
									<li
										key={feature.label}
										className={`flex items-center gap-3 text-sm border-b pb-4 last:border-0 ${
											plan.highlighted ? "border-white/10" : "border-line-2"
										} ${
											!feature.included
												? plan.highlighted
													? "text-white/30"
													: "text-text-subtle"
												: plan.highlighted
													? "text-white"
													: "text-text-base"
										}`}
									>
										{feature.included ? (
											<Check size={15} className={plan.highlighted ? "text-green shrink-0" : "text-green shrink-0"} />
										) : (
											<X size={15} className="shrink-0 opacity-40" />
										)}
										{feature.label}
									</li>
								))}
							</ul>

							{/* CTA */}
							<Link
								href={plan.href}
								className={`block text-center font-semibold text-sm py-3.5 rounded-[10px] transition-colors ${
									plan.highlighted
										? "bg-brand hover:bg-brand-hover text-white"
										: "bg-bg border border-line hover:bg-line-2 text-ink"
								}`}
							>
								{plan.cta}
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PricingSection;
