"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IPlatform {
	id: string;
	name: string;
}

export const getPlatforms = async () => {
	try {
		const result = await httpClient.get<IPlatform[]>("/platforms?limit=100");
		return result.data ?? [];
	} catch (error) {
		console.log("Error fetching platforms:", error);
		return [];
	}
};
