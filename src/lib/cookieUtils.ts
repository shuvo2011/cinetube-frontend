"use server";

import { cookies } from "next/headers";

const cookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "none" as const,
	path: "/",
};

export const setCookie = async (name: string, value: string, maxAgeInSeconds: number) => {
	const cookieStore = await cookies();
	cookieStore.set(name, value, {
		...cookieOptions,
		maxAge: maxAgeInSeconds,
	});
};

export const getCookie = async (name: string) => {
	const cookieStore = await cookies();
	return cookieStore.get(name)?.value;
};

export const deleteCookie = async (name: string) => {
	const cookieStore = await cookies();
	cookieStore.delete(name);
};
