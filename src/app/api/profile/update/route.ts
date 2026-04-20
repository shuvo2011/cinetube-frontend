import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PATCH(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join("; ");

		const formData = await req.formData();

		const res = await fetch(`${API_BASE_URL}/users/update-profile`, {
			method: "PATCH",
			headers: { Cookie: cookieHeader },
			body: formData,
		});

		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch (error: any) {
		console.error("Profile update proxy error:", error);
		return NextResponse.json({ message: error?.message ?? "Failed to update profile" }, { status: 500 });
	}
}
