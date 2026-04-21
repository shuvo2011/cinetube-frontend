import RegisterForm from "@/components/modules/Auth/RegisterForm";
import { Suspense } from "react";

export const metadata = {
	title: "Register - Create Your Account | CineTube",
	description:
		"Join CineTube today! Create a free account to rate movies and TV series on a 1-10 scale, write reviews, build watchlists, and connect with fellow cinephiles.",
};

const RegisterPage = () => {
	return (
		<Suspense>
			<RegisterForm />
		</Suspense>
	);
};

export default RegisterPage;
