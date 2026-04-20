"use server";

import { httpClient } from "@/lib/axios/httpClient";

import { ITag } from "@/types/tag.types";

export const getTags = async () => {
	try {
		const result = await httpClient.get<any>("/tags?limit=100");
		return (result.data ?? []) as ITag[];
	} catch (error) {
		console.log("Error fetching tags:", error);
		return [];
	}
};

export const getTagsForAdmin = async (queryString: string) => {
	try {
		return await httpClient.get<ITag[]>(queryString ? `/tags?${queryString}` : "/tags");
	} catch (error) {
		console.log("Error fetching tags:", error);
		throw error;
	}
};
