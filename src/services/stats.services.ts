"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IDashboardStats } from "@/types/stats.types";

export const getDashboardStats = async () => {
	try {
		const result = await httpClient.get<IDashboardStats>("/stats");
		return result;
	} catch (error) {
		console.log("Error fetching dashboard stats:", error);
		return null;
	}
};
