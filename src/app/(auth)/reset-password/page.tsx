// src/app/(auth)/reset-password/page.tsx
import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { Suspense } from "react";

const ResetPasswordPage = () => {
	return (
		<Suspense>
			<ResetPasswordForm />
		</Suspense>
	);
};
export default ResetPasswordPage;
