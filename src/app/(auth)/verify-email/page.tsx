import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { Suspense } from "react";

const VerifyEmailPage = () => {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	);
};

export default VerifyEmailPage;
