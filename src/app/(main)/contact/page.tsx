export const dynamic = "force-dynamic";
import ContactClient from "@/components/modules/contact/ContactClient";

export const metadata = {
	title: "Contact Us - Get in Touch | CineTube",
	description:
		"Have questions or feedback? Contact the CineTube team. We're here to help with account issues, billing inquiries, suggestions, and support requests.",
};

export default function ContactPage() {
	return <ContactClient />;
}
