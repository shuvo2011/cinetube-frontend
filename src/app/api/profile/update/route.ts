import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "@/lib/axios/httpClient";

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();

		const res = await httpClient.patch("/users/update-profile", body);

		return NextResponse.json(res, { status: 200 });
	} catch (error: any) {
		console.error("Profile update proxy error:", error);

		return NextResponse.json(
			{
				message: error?.response?.data?.message ?? error?.message ?? "Failed to update profile",
			},
			{ status: error?.response?.status ?? 500 },
		);
	}
}
