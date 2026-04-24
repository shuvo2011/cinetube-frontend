import { IPayment } from "@/services/payment.services";

export const DURATION_LABELS: Record<string, string> = {
	DAYS_1: "1 Day",
	DAYS_2: "2 Days",
	DAYS_3: "3 Days",
	DAYS_5: "5 Days",
	DAYS_7: "7 Days",
	DAYS_14: "14 Days",
	DAYS_15: "15 Days",
};

export const isPaymentActive = (payment: IPayment) => {
	if (payment.status !== "COMPLETED") return false;

	if (payment.purchaseType === "BUY") return true;

	if (payment.purchaseType === "RENT") {
		return !!payment.rentExpiresAt && new Date(payment.rentExpiresAt) >= new Date();
	}

	if (payment.purchaseType === "SUBSCRIPTION") {
		return !!payment.subscriptionEndsAt && new Date(payment.subscriptionEndsAt) >= new Date();
	}

	return false;
};
