import LoginForm from "@/components/modules/Auth/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
};

export default LoginPage;
