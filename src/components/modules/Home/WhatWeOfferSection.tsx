import { Heart, Play, PenLine } from "lucide-react";

const offers = [
	{
		icon: <PenLine size={20} className="text-brand" />,
		title: "Community Reviews",
		description: "Read honest reviews from thousands of movie lovers. Rate on a 1–10 scale and share your thoughts.",
	},
	{
		icon: <Play size={20} className="text-brand fill-brand" />,
		title: "Stream Premium",
		description: "Subscribe to stream thousands of movies and series in HD and 4K quality on all your devices.",
	},
	{
		icon: <Heart size={20} className="text-brand fill-brand" />,
		title: "Personal Watchlist",
		description: "Save titles to your watchlist, track what you've watched, and get personalized recommendations.",
	},
];

const WhatWeOfferSection = () => {
	return (
		<section className="py-16 md:py-20 bg-bg">
			<div className="max-w-350 mx-auto px-6 md:px-10">
				{/* Top */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
					<div>
						<p className="text-xs font-semibold tracking-widest text-brand uppercase mb-3">What We Offer</p>
						<h2 className="text-[36px] md:text-[42px] font-black tracking-tight text-ink leading-tight max-w-lg">
							Everything You Need In One Platform
						</h2>
					</div>
					<p className="text-[15px] text-text-muted max-w-sm md:text-right leading-relaxed">
						Browse, rate, review and stream — CineTube gives you the complete movie experience.
					</p>
				</div>

				{/* Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{offers.map((offer) => (
						<div key={offer.title} className="bg-bg-2 border border-line rounded-[14px] p-7">
							<div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center mb-5">
								{offer.icon}
							</div>
							<h3 className="text-[17px] font-bold text-ink mb-2">{offer.title}</h3>
							<p className="text-sm text-text-muted leading-relaxed">{offer.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default WhatWeOfferSection;
