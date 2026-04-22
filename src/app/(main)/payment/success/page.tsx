export const dynamic = "force-dynamic";
import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "Purchase Confirmed - CineTube",
	description: "Payment successful! You've got your access. Visit your dashboard to enjoy your movies and series.",
};

const PaymentSuccessPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
			<div className="text-center space-y-6 max-w-md">
				<div className="flex justify-center">
					<div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
						<CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thank You for Your Purchase!</h1>
					<p className="text-gray-600 dark:text-gray-300">You've successfully got your access.</p>
					<p className="text-sm text-gray-500 dark:text-gray-400">You can check your purchases on your dashboard.</p>
				</div>

				<div className="flex gap-3 justify-center pt-4">
					<Button asChild variant="outline">
						<Link href="/dashboard">Go to Dashboard</Link>
					</Button>
					<Button asChild>
						<Link href="/">Back to Home</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccessPage;
