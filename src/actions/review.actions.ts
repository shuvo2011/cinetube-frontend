"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateReviewStatus = async (id: string, status: string) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	const res = await fetch(`${BASE_API_URL}/reviews/${id}/status`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Cookie: `accessToken=${accessToken}`,
		},
		body: JSON.stringify({ status }),
	});

	return res.json();
};

export const deleteReview = async (id: string) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	const res = await fetch(`${BASE_API_URL}/reviews/${id}`, {
		method: "DELETE",
		headers: {
			Cookie: `accessToken=${accessToken}`,
		},
	});

	return res.json();
};
