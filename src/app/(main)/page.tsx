import { HOME_HERO_LIMIT, HOME_NEW_RELEASES_LIMIT, HOME_TOP_RATED_LIMIT } from "@/constants/home.constants";
import { getMovies, getTopRatedMovies } from "@/services/movie.services";
import HeroSection from "@/components/modules/Home/HeroSection";
import WhatWeOfferSection from "@/components/modules/Home/WhatWeOfferSection";
import NewReleasesSection from "@/components/modules/Home/NewReleasesSection";
import TopRatedSection from "@/components/modules/Home/TopRatedSection";
import PricingSection from "@/components/modules/Home/PricingSection";

const HomePage = async () => {
	const [featuredRes, latestRes, topRatedRes] = await Promise.all([
		getMovies(`isFeatured=true&limit=${HOME_HERO_LIMIT}`),
		getMovies(`limit=${HOME_NEW_RELEASES_LIMIT}&sortBy=createdAt&sortOrder=desc`),
		getTopRatedMovies(HOME_TOP_RATED_LIMIT),
	]);

	const heroMovies =
		featuredRes?.data && featuredRes.data.length > 0
			? featuredRes.data
			: (latestRes?.data?.slice(0, HOME_HERO_LIMIT) ?? []);

	return (
		<main>
			<HeroSection movies={heroMovies} />
			<WhatWeOfferSection />
			<NewReleasesSection movies={latestRes?.data ?? []} />
			<TopRatedSection movies={topRatedRes ?? []} />
			<PricingSection />
		</main>
	);
};

export default HomePage;
