"use client";

import React, { useState, useEffect, useRef } from "react";
import UserProfileForm from "@/components/modules/UserProfile/UserProfileForm";

const DashboardProfilePage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-[22px] font-bold text-ink">My Profile</h1>
				<p className="text-[13px] text-text-muted mt-0.5">Update your name, email and avatar</p>
			</div>

			<UserProfileForm />
		</div>
	);
};

export default DashboardProfilePage;
