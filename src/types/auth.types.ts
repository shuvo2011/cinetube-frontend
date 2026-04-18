export interface ILoginResponse {
	token: string;
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		status: string;
		image: string | null;
		isDeleted: boolean;
		emailVerified: boolean;
	};
}

export interface IRegisterResponse {
	token: string;
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		status: string;
		emailVerified: boolean;
	};
}
