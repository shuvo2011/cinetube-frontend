"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICastMember } from "@/types/castMember.types";

export async function createCastMemberAction(name: string): Promise<ApiResponse<ICastMember>> {
	return httpClient.post<ICastMember>("/cast-members", { name });
}

export async function updateCastMemberAction(id: string, name: string): Promise<ApiResponse<ICastMember>> {
	return httpClient.patch<ICastMember>(`/cast-members/${id}`, { name });
}

export async function deleteCastMemberAction(id: string): Promise<ApiResponse<ICastMember>> {
	return httpClient.delete<ICastMember>(`/cast-members/${id}`);
}
