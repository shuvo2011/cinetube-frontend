"use server";

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
