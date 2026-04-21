import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "CineTube",
		template: "%s",
	},
	description: "CineTube - Movie and Series Rating & Streaming Portal.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col">
				<QueryProviders>
					{children}
					<Toaster position="top-right" richColors />
				</QueryProviders>
			</body>
		</html>
	);
}
