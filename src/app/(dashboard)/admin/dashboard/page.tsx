import AdminDashboardClient from "@/components/modules/AdminDashboardClient/AdminDashboardClient";

export const metadata = {
	title: "Analytics Dashboard - Overview | CineTube Admin",
	description:
		"View key analytics and metrics for CineTube. Track total users, movies, series, ratings, reviews, revenue, subscriptions, and platform performance at a glance.",
};

export const dynamic = "force-dynamic";

const AdminDashboardPage = () => {
	return <AdminDashboardClient />;
};

export default AdminDashboardPage;
