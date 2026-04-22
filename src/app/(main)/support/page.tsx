export const dynamic = "force-dynamic";
import Link from "next/link";
import {
	HelpCircle,
	Mail,
	FileText,
	Clock,
	ShieldCheck,
	ArrowRight,
	Globe,
	Phone,
	PlayCircle,
	Star,
	MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "Support - Help Center | CineTube",
	description:
		"Get help with your CineTube account. Find answers to common questions, contact support, report issues, and learn how to make the most of your CineTube experience.",
};

const supportCategories = [
	{
		icon: HelpCircle,
		title: "Account Issues",
		description: "Login problems, password reset, email verification, and account recovery.",
		buttonText: "View Account Help",
		color: "bg-[#FEF2F2]",
		iconColor: "text-[#EF4C5C]",
		iconBg: "bg-[#FDE7EA]",
	},
	{
		icon: FileText,
		title: "Billing & Payments",
		description: "Subscription plans, refunds, payment methods, and invoice requests.",
		buttonText: "View Billing Help",
		color: "bg-[#FDF1D5]",
		iconColor: "text-[#D97706]",
		iconBg: "bg-[#FEF3C7]",
	},
	{
		icon: PlayCircle,
		title: "Streaming Problems",
		description: "Buffering issues, quality settings, device compatibility, and playback errors.",
		buttonText: "View Streaming Help",
		color: "bg-[#DDF4E5]",
		iconColor: "text-[#16A34A]",
		iconBg: "bg-[#DCFCE7]",
	},
	{
		icon: Star,
		title: "Ratings & Reviews",
		description: "How ratings work, review guidelines, reporting inappropriate content.",
		buttonText: "View Reviews Help",
		color: "bg-[#DBEAFE]",
		iconColor: "text-[#1D4ED8]",
		iconBg: "bg-[#DBEAFE]",
	},
	{
		icon: ShieldCheck,
		title: "Privacy & Security",
		description: "Data protection, account security, GDPR compliance, and privacy settings.",
		buttonText: "View Privacy Help",
		color: "bg-[#E2E1FB]",
		iconColor: "text-[#6D28D9]",
		iconBg: "bg-[#EDE9FE]",
	},
	{
		icon: Clock,
		title: "Technical Support",
		description: "Browser issues, mobile access, error messages, and bug reports.",
		buttonText: "View Tech Help",
		color: "bg-[#FCE7F3]",
		iconColor: "text-[#BE185D]",
		iconBg: "bg-[#FCE7F3]",
	},
];

const faqs = [
	{
		q: "How do I reset my password?",
		a: "Click 'Forgot Password' on the login page, enter your email address, and follow the reset link sent to your inbox. The link expires in 24 hours.",
	},
	{
		q: "Why is my video buffering?",
		a: "Buffering usually happens due to slow internet connection. Try lowering the video quality to 720p or 480p. For 4K streaming, we recommend at least 25 Mbps speed.",
	},
	{
		q: "Can I get a refund for my subscription?",
		a: "Monthly subscriptions can be cancelled anytime but are non-refundable. Yearly plans have a 7-day money-back guarantee if you've watched less than 2 hours of content.",
	},
	{
		q: "How do I report a review?",
		a: "Click the 'Report' button under any review. Our moderation team will review it within 24 hours and take appropriate action if it violates our guidelines.",
	},
	{
		q: "Is my payment information secure?",
		a: "Yes. All payments are processed through PCI-compliant gateways. We never store your full card details on our servers.",
	},
	{
		q: "How do I delete my account?",
		a: "Go to Dashboard → Profile → Account Settings → Delete Account. This action is permanent and will remove all your reviews and data.",
	},
];

const contactMethods = [
	{
		icon: Mail,
		title: "Email Support",
		info: "support@cinetube.com",
		action: "mailto:support@cinetube.com",
		buttonText: "Send Email",
		color: "bg-[#FEF2F2]",
		iconColor: "text-[#EF4C5C]",
	},
	{
		icon: Phone,
		title: "Phone Support",
		info: "+1 (800) 123-4567",
		action: "tel:+18001234567",
		buttonText: "Call Us",
		color: "bg-[#FDF1D5]",
		iconColor: "text-[#D97706]",
	},
	{
		icon: MapPin,
		title: "Visit Office",
		info: "123 Cinema St, NY 10001",
		action: "https://maps.google.com/?q=123+Cinema+St+NY",
		buttonText: "Get Directions",
		color: "bg-[#FCE7F3]",
		iconColor: "text-[#BE185D]",
		iconBg: "bg-[#FCE7F3]",
	},
	{
		icon: Globe,
		title: "Social Media",
		info: "Follow @cinetube",
		action: "https://twitter.com/cinetube",
		buttonText: "Follow Us",
		color: "bg-[#E0F2FE]",
		iconColor: "text-[#0284C7]",
	},
];

const SupportPage = () => {
	return (
		<div className="bg-white min-h-screen">
			<section className="bg-[#FEF2F2] py-20 relative overflow-hidden">
				<div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />
				<div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />

				<div className="max-w-[1280px] mx-auto px-10 relative z-10 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-5">
						<HelpCircle className="w-3.5 h-3.5 text-[#EF4C5C]" />
						<span>We're Here to Help</span>
					</div>

					<h1 className="text-[56px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-[1.02] mb-6">
						How Can We <em className="not-italic text-[#EF4C5C]">Help You?</em>
					</h1>

					<p className="text-[17px] text-[#6B6B73] max-w-xl mx-auto mb-10 leading-relaxed">
						Find answers to common questions, contact our support team, or browse our help guides to get the most out of
						CineTube.
					</p>

					<div className="flex gap-3 justify-center flex-wrap">
						<Button
							asChild
							size="lg"
							className="bg-[#EF4C5C] hover:bg-[#DC3545] text-white rounded-[10px] px-6 font-semibold"
						>
							<Link href="/contact">
								Contact Support <ArrowRight className="w-4 h-4 ml-1" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="flex justify-between items-end mb-12">
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">
								SUPPORT CATEGORIES
							</p>
							<h2 className="text-[42px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] max-w-lg">
								Find Help By Topic
							</h2>
						</div>
						<p className="text-[15px] text-[#6B6B73] max-w-xs text-right">Quick answers to common questions.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{supportCategories.map((category) => {
							const Icon = category.icon;
							return (
								<div
									key={category.title}
									className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-8 flex flex-col gap-4 hover:shadow-[0_4px_16px_rgba(15,15,16,0.06)] transition-shadow"
								>
									<div className="flex items-center justify-between">
										<div
											className={`w-12 h-12 rounded-[12px] ${category.iconBg} ${category.iconColor} flex items-center justify-center`}
										>
											<Icon className="w-5 h-5" />
										</div>
									</div>
									<h3 className="text-[19px] font-bold text-[#0F0F10] tracking-[-0.01em]">{category.title}</h3>
									<p className="text-[14px] text-[#6B6B73] leading-[1.6]">{category.description}</p>
									<Button
										asChild
										variant="link"
										className="text-[#EF4C5C] p-0 h-auto font-semibold text-[14px] justify-start"
									>
										<Link href="/contact">{category.buttonText} →</Link>
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section id="faq" className="py-20 bg-[#FAFAFA]">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="flex justify-between items-end mb-12">
						<div>
							<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">FAQ</p>
							<h2 className="text-[38px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05]">
								Frequently Asked Questions
							</h2>
						</div>
						<p className="text-[15px] text-[#6B6B73] max-w-xs text-right">
							Still have questions?{" "}
							<Link href="/contact" className="text-[#EF4C5C] font-semibold hover:underline">
								Contact us →
							</Link>
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{faqs.map((faq) => (
							<div key={faq.q} className="bg-white border border-[#F2F2F5] rounded-[14px] p-6">
								<h3 className="text-[16px] font-bold text-[#0F0F10] mb-2">{faq.q}</h3>
								<p className="text-[14px] text-[#6B6B73] leading-relaxed">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section id="contact" className="py-20">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="text-center mb-12">
						<p className="text-[11px] font-bold text-[#EF4C5C] tracking-[0.18em] uppercase mb-3">CONTACT US</p>
						<h2 className="text-[38px] font-extrabold tracking-[-0.025em] text-[#0F0F10] leading-[1.05] mb-4">
							Get In Touch
						</h2>
						<p className="text-[15px] text-[#6B6B73] max-w-md mx-auto">
							Choose the method that works best for you. Our team is ready to help 24/7.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
						{contactMethods.map((method) => {
							const Icon = method.icon;
							return (
								<div
									key={method.title}
									className={`${method.color} rounded-[18px] p-6 flex flex-col items-center text-center gap-3`}
								>
									<div
										className={`w-14 h-14 rounded-full bg-white flex items-center justify-center ${method.iconColor}`}
									>
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-[18px] font-bold text-[#0F0F10]">{method.title}</h3>
									<p className="text-[13px] text-[#6B6B73]">{method.info}</p>
									<Button asChild size="sm" className="mt-2 bg-white text-[#0F0F10] hover:bg-gray-50 rounded-[8px]">
										<Link href={method.action}>{method.buttonText}</Link>
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="bg-[#EF4C5C] py-20">
				<div className="max-w-[1280px] mx-auto px-10 text-center">
					<Clock className="w-12 h-12 text-white mx-auto mb-6" />
					<h2 className="text-[38px] font-extrabold tracking-tight text-white mb-4">Fast Response Guarantee</h2>
					<p className="text-white/70 text-[16px] mb-10 max-w-md mx-auto">
						We respond to all support requests within 24 hours. Most issues are resolved within 4 hours.
					</p>
					<div className="flex gap-3 justify-center flex-wrap">
						<Button
							asChild
							size="lg"
							className="bg-white text-[#EF4C5C] hover:bg-[#FAFAFA] rounded-[10px] px-6 font-semibold"
						>
							<Link href="/contact">Contact Us</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="border-white/40 text-white bg-transparent hover:bg-white/10 rounded-[10px] px-6 font-semibold"
						>
							<Link href="/terms">Terms</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default SupportPage;
