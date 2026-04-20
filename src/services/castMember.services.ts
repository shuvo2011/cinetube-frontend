"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICastMember } from "@/types/castMember.types";

export const getCastMembers = async (queryString: string) => {
	try {
		return await httpClient.get<ICastMember[]>(queryString ? `/cast-members?${queryString}` : "/cast-members");
	} catch (error) {
		console.log("Error fetching cast members:", error);
		throw error;
	}
};
