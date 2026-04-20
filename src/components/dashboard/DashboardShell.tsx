"use client";

import { useState } from "react";
import AppSidebar from "@/components/dashboard/AppSidebar";
import AppHeader from "@/components/dashboard/AppHeader";

type Props = {
	role: "ADMIN" | "USER";
	userName: string;
	userEmail: string;
	children: React.ReactNode;
};

// Client component — only manages sidebar open/close state
export default function DashboardShell({ role, userName, userEmail, children }: Props) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-gray-50">
			<AppSidebar
				role={role}
				userName={userName}
				userEmail={userEmail}
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			{/* Content — desktop offset by sidebar width */}
			<div className="flex min-h-screen w-full flex-col lg:ml-[260px]">
				<AppHeader role={role} userName={userName} userEmail={userEmail} onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 p-4 lg:p-7">{children}</main>
			</div>
		</div>
	);
}
