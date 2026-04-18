// src/app/(auth)/forgot-password/page.tsx
import ForgotPasswordForm from "@/components/modules/Auth/ForgotPasswordForm";
import { Suspense } from "react";

const ForgotPasswordPage = () => {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	);
};
export default ForgotPasswordPage;
