import UserProfileForm from "@/components/modules/UserProfile/UserProfileForm";

export const metadata = {
	title: "My Profile - Account Settings | CineTube",
	description:
		"Manage your CineTube profile. Update personal information, change password, upload profile picture, and customize your account preferences.",
};

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
