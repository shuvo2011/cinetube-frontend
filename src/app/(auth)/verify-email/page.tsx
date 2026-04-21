import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { Suspense } from "react";

export const metadata = {
	title: "Verify Email - Confirm Your Email Address | CineTube",
	description:
		"Verify your email address to activate your CineTube account. Check your inbox for the verification link and complete your registration.",
};

const VerifyEmailPage = () => {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	);
};

export default VerifyEmailPage;
