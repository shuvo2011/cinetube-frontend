"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface ITag {
	id: string;
	name: string;
}

export const getTags = async () => {
	try {
		const result = await httpClient.get<any>("/tags?limit=100");
		return (result.data ?? []) as ITag[];
	} catch (error) {
		console.log("Error fetching tags:", error);
		return [];
	}
};
