"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IPlatform } from "@/types/platform.types";

type PlatformPayload = {
	name: string;
	logo?: string;
	website?: string;
};

export async function createPlatformAction(payload: PlatformPayload): Promise<ApiResponse<IPlatform>> {
	return httpClient.post<IPlatform>("/platforms", payload);
}

export async function updatePlatformAction(
	id: string,
	payload: Partial<PlatformPayload>,
): Promise<ApiResponse<IPlatform>> {
	return httpClient.patch<IPlatform>(`/platforms/${id}`, payload);
}

export async function deletePlatformAction(id: string): Promise<ApiResponse<IPlatform>> {
	return httpClient.delete<IPlatform>(`/platforms/${id}`);
}
