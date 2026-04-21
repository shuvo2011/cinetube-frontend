"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/dashboard/AppSidebar";
import AppHeader from "@/components/dashboard/AppHeader";
import { getMyProfile } from "@/services/user.services";

type Props = {
	role: "ADMIN" | "USER";
	userName: string;
	userEmail: string;
	children: React.ReactNode;
};

export default function DashboardShell({ role, userName, userEmail, children }: Props) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const { data: profileRes } = useQuery({ queryKey: ["me"], queryFn: getMyProfile });
	const liveUserName = profileRes?.data?.name ?? userName;
	const liveUserEmail = profileRes?.data?.email ?? userEmail;

	return (
		<div className="flex min-h-screen bg-gray-50">
			<AppSidebar
				role={role}
				userName={liveUserName}
				userEmail={liveUserEmail}
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<div className="flex min-h-screen w-full flex-col lg:ml-[260px]">
				<AppHeader
					role={role}
					userName={liveUserName}
					userEmail={liveUserEmail}
					onMenuClick={() => setSidebarOpen(true)}
				/>
				<main className="flex-1 p-4 lg:p-7">{children}</main>
			</div>
		</div>
	);
}
