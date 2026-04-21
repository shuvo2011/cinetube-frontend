"use server";

import { ApiResponse } from "@/types/api.types";
import { httpClient } from "@/lib/axios/httpClient";

export interface IMovieAccess {
	hasAccess: boolean;
	accessType?: "FREE" | "SUBSCRIPTION" | "BOUGHT" | "RENTED";
	expiresAt?: string;
}

export interface IPaymentMovie {
	id: string;
	title: string;
	posterImage: string | null;
}

export interface IPayment {
	id: string;
	movieId: string | null;
	amount: number;
	currency: string;
	status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	purchaseType: "RENT" | "BUY" | "SUBSCRIPTION";
	planType: "MONTHLY" | "YEARLY" | null;
	rentalDuration: string | null;
	rentExpiresAt: string | null;
	subscriptionEndsAt: string | null;
	transactionId: string | null;
	createdAt: string;
	movie: IPaymentMovie | null;
}

export interface IAdminPayment extends IPayment {
	userId: string;
	gateway: string;
	stripeCustomerId: string | null;
	subscriptionId: string | null;
	invoiceUrl: string | null;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export const getAllPayments = async (queryString: string): Promise<ApiResponse<IAdminPayment[]>> => {
	const endpoint = queryString ? `/payments?${queryString}` : "/payments";
	return httpClient.get<IAdminPayment[]>(endpoint);
};

export const getMyPayments = async (): Promise<IPayment[]> => {
	try {
		const result = await httpClient.get<IPayment[]>("/payments/my-payments?limit=100&sortBy=createdAt&sortOrder=desc");
		return result.data ?? [];
	} catch {
		return [];
	}
};

export const checkMovieAccess = async (movieId: string): Promise<IMovieAccess | null> => {
	try {
		const result = await httpClient.get<IMovieAccess>(`/payments/access/${movieId}`);
		return result.data ?? null;
	} catch {
		return null;
	}
};
