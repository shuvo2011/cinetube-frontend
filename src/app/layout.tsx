import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CineTube",
	description: "Movie and Series Rating & Streaming Portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col">
				<QueryProviders>{children}</QueryProviders>
			</body>
		</html>
	);
}
