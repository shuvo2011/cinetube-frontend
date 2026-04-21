import ForgotPasswordForm from "@/components/modules/Auth/ForgotPasswordForm";
import { Suspense } from "react";

export const metadata = {
	title: "Forgot Password - Reset Your Account | CineTube",
	description:
		"Reset your CineTube account password. Enter your email address to receive password reset instructions and regain access to your account.",
};

const ForgotPasswordPage = () => {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	);
};
export default ForgotPasswordPage;
