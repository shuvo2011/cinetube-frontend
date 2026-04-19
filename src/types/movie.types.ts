export interface IMovie {
	id: string;
	title: string;
	synopsis: string;
	releaseYear: number;
	director: string;
	posterImage: string | null;
	trailerUrl: string | null;
	streamingUrl: string | null;
	pricingType: "FREE" | "PREMIUM";
	rentPrice: number;
	buyPrice: number;
	isFeatured: boolean;
	averageRating?: number;
	totalReviews?: number;
	createdAt: string;
	genres: {
		genre: {
			id: string;
			name: string;
		};
	}[];
}
