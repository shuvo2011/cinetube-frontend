import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { Suspense } from "react";

export const metadata = {
	title: "Verify Password - Secure Your Account | CineTube",
	description:
		"Verify your password to access sensitive account settings. This extra security step helps protect your CineTube account from unauthorized changes.",
};

const ResetPasswordPage = () => {
	return (
		<Suspense>
			<ResetPasswordForm />
		</Suspense>
	);
};
export default ResetPasswordPage;
