import LoginForm from "@/components/modules/Auth/LoginForm";
import { Suspense } from "react";

export const metadata = {
	title: "Login - Sign In to Your Account | CineTube",
	description:
		"Sign in to your CineTube account. Rate movies, write reviews, create watchlists, and track your favorite TV series. Welcome back!",
};

const LoginPage = () => {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
};

export default LoginPage;
