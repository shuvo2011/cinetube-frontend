"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IPlatform } from "@/types/platform.types";

export const getPlatforms = async (queryString: string) => {
	try {
		return await httpClient.get<IPlatform[]>(queryString ? `/platforms?${queryString}` : "/platforms");
	} catch (error) {
		console.log("Error fetching platforms:", error);
		throw error;
	}
};
