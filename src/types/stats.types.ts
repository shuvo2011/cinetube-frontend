export interface IDashboardStats {
	summary: {
		totalMovies: number;
		featuredMoviesCount: number;
		pricingTypeCounts: Record<string, number>;
		totalUsers: number;
		activeUsers: number;
		blockedUsers: number;
		deletedUsers: number;
		activeSubscribers: number;
		totalRevenue: number;
		totalRentals: number;
		totalPurchases: number;
		totalSubscriptionRevenue: number;
	};
	reviewStats: {
		pending: number;
		published: number;
		draft: number;
		unpublished: number;
		totalPublishedReviews: number;
		averageRatingOverall: number;
	};
	userStats: {
		newUsersLast7Days: number;
		newUsersLast30Days: number;
		newSubscribersLast7Days: number;
	};
	paymentStats: {
		revenueByType: { type: string; amount: number }[];
		monthlyRevenue: { month: string; revenue: number }[];
	};
	trendStats: {
		reviewsByDay: { label: string; date: string; count: number }[];
	};
	ratingReports: {
		topRatedTitles: { id: string; title: string; averageRating: number; totalReviews: number }[];
		mostReviewedTitles: { id: string; title: string; totalReviews: number; averageRating: number }[];
	};
	genreDistribution: { genre: string; count: number }[];
	platformDistribution: { platform: string; count: number }[];
}
