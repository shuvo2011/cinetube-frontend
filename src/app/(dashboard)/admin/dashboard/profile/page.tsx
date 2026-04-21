import UserProfileForm from "@/components/modules/UserProfile/UserProfileForm";

export const metadata = {
	title: "Profile - Admin Account Settings - CineTube Admin",
	description:
		"Manage your admin profile information. Update name, email, password, and profile picture. Keep your CineTube admin account secure and up to date.",
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
