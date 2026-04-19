import { getMovies } from "@/services/movie.services";
import HeroSection from "@/components/modules/Home/HeroSection";

const HomePage = async () => {
	const [featuredRes, latestRes] = await Promise.all([
		getMovies("isFeatured=true&limit=3"),
		getMovies("limit=3&sortBy=createdAt&sortOrder=desc"),
	]);

	const heroMovies = featuredRes?.data && featuredRes.data.length > 0 ? featuredRes.data : (latestRes?.data ?? []);

	return (
		<main>
			<HeroSection movies={heroMovies} />
		</main>
	);
};

export default HomePage;
