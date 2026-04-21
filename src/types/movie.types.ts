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
	totalLikes?: number;
	_count?: {
		watchlists: number;
	};
	rentDuration: string | null;
	genres: {
		genre: {
			id: string;
			name: string;
		};
	}[];
	platforms?: {
		platform: {
			id: string;
			name: string;
		};
	}[];
	movieCasts?: {
		castMemberId: string;
		movieId: string;
		castMember: {
			id: string;
			name: string;
		};
	}[];
}

export interface IPlatform {
	id: string;
	name: string;
}

export interface IGenre {
	id: string;
	name: string;
}

export type MovieFilters = {
	genres: IGenre[];
	platforms: IPlatform[];
	availableYears: number[];
};
