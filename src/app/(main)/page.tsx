import { HOME_HERO_LIMIT, HOME_NEW_RELEASES_LIMIT } from "@/constants/home.constants";
import { getMovies } from "@/services/movie.services";
import HeroSection from "@/components/modules/Home/HeroSection";
import WhatWeOfferSection from "@/components/modules/Home/WhatWeOfferSection";
import NewReleasesSection from "@/components/modules/Home/NewReleasesSection";

const HomePage = async () => {
	const [featuredRes, latestRes] = await Promise.all([
		getMovies(`isFeatured=true&limit=${HOME_HERO_LIMIT}`),
		getMovies(`limit=${HOME_NEW_RELEASES_LIMIT}&sortBy=createdAt&sortOrder=desc`),
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
		</main>
	);
};

export default HomePage;
