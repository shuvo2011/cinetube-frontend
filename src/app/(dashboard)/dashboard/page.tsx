import UserDashboardClient from "@/components/modules/UserDashboardClient/UserDashboardClient";

export const metadata = {
	title: "My Dashboard - Your Activity & Analytics | CineTube",
	description:
		"View your personal analytics on CineTube. Track your ratings, reviews, watchlist, watch history, and engagement stats. See your movie and series activity at a glance.",
};

export const dynamic = "force-dynamic";

const DashboardPage = () => {
	return <UserDashboardClient />;
};

export default DashboardPage;
