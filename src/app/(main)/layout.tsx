import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getUserInfo } from "@/services/auth.services";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getUserInfo();

	return (
		<>
			<Navbar userInfo={user} />
			{children}
			<Footer />
		</>
	);
}
