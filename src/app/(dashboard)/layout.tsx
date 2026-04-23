import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { COOKIE_NAMES } from "@/utils/cookie.constants";

type JwtPayload = {
	id: string;
	email: string;
	name: string;
	role: "ADMIN" | "USER" | "SUPER_ADMIN";
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

	if (!accessToken) redirect("/login");

	let payload: JwtPayload;

	try {
		payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
	} catch {
		redirect("/login");
	}

	const role = payload.role === "SUPER_ADMIN" ? "ADMIN" : payload.role;

	return (
		<DashboardShell role={role as "ADMIN" | "USER"} userName={payload.name} userEmail={payload.email}>
			{children}
		</DashboardShell>
	);
}
