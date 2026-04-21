import Link from "next/link";
import { Shield, Eye, Database, Cookie, Lock, Bell, Mail, Download, Trash2, Globe } from "lucide-react";

export const metadata = {
	title: "Privacy Policy - Your Data Protection | CineTube",
	description:
		"Learn how CineTube collects, uses, and protects your personal information. We are committed to transparency and data privacy for all our users.",
};

const sections = [
	{
		icon: Database,
		title: "Information We Collect",
		content: [
			"Account information (name, email address, profile picture)",
			"Rating and review history on movies and TV series",
			"Watchlist and viewing preferences",
			"Payment information for subscriptions and rentals",
			"Device information and IP address for security",
			"Communication history with our support team",
		],
	},
	{
		icon: Eye,
		title: "How We Use Your Information",
		content: [
			"Provide personalized movie and series recommendations",
			"Process your ratings, reviews, and watchlists",
			"Handle subscription payments and rentals",
			"Improve our platform and user experience",
			"Send important account notifications",
			"Prevent fraud and ensure platform security",
		],
	},
	{
		icon: Cookie,
		title: "Cookies & Tracking",
		content: [
			"Essential cookies for platform functionality",
			"Analytics cookies to improve performance",
			"Preference cookies to remember your settings",
			"You can manage cookie preferences in browser settings",
			"Third-party cookies from embedded content (trailers, etc.)",
		],
	},
	{
		icon: Lock,
		title: "Data Security",
		content: [
			"256-bit SSL encryption for all transactions",
			"Regular security audits and penetration testing",
			"Secure password hashing with bcrypt",
			"Two-factor authentication option for accounts",
			"Automated suspicious activity detection",
			"No credit card details stored on our servers",
		],
	},
	{
		icon: Globe,
		title: "Data Sharing",
		content: [
			"We never sell your personal data to third parties",
			"Anonymous aggregate data used for platform analytics",
			"Payment processed through PCI-compliant partners (Stripe, PayPal)",
			"Legal compliance when required by law enforcement",
			"Your reviews and ratings are public by default",
		],
	},
	{
		icon: Bell,
		title: "Your Rights",
		content: [
			"Access all your personal data anytime",
			"Request correction of inaccurate information",
			"Delete your account and all associated data",
			"Opt-out of marketing communications",
			"Export your data in JSON or CSV format",
			"Withdraw consent at any time",
		],
	},
];

const PrivacyPolicyPage = () => {
	return (
		<div className="bg-white min-h-screen">
			{/* ── Hero Section ── */}
			<section className="bg-[#FEF2F2] py-20 relative overflow-hidden">
				<div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />
				<div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />

				<div className="max-w-[1280px] mx-auto px-10 relative z-10 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-5">
						<Shield className="w-3.5 h-3.5 text-[#EF4C5C]" />
						<span>Your Privacy Matters</span>
					</div>

					<h1 className="text-[56px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-[1.02] mb-6">
						Privacy <em className="not-italic text-[#EF4C5C]">Policy</em>
					</h1>

					<p className="text-[17px] text-[#6B6B73] max-w-2xl mx-auto mb-6 leading-relaxed">
						At CineTube, we take your privacy seriously. This policy explains how we collect, use, and protect your
						personal information when you use our platform to rate, review, and stream movies and TV series.
					</p>

					<p className="text-[13px] text-[#6B6B73]">
						Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
					</p>
				</div>
			</section>

			{/* ── Quick Navigation ── */}
			<section className="bg-white border-b border-[#F2F2F5] sticky top-0 z-10">
				<div className="max-w-[1280px] mx-auto px-10 py-4">
					<div className="flex flex-wrap gap-3 justify-center">
						{sections.map((section) => (
							<a
								key={section.title}
								href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
								className="text-[13px] text-[#6B6B73] hover:text-[#EF4C5C] transition-colors px-3 py-1.5 rounded-full hover:bg-[#FEF2F2]"
							>
								{section.title}
							</a>
						))}
					</div>
				</div>
			</section>

			{/* ── Main Content ── */}
			<section className="py-16">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
						{/* Sidebar */}
						<div className="lg:col-span-3">
							<div className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-6 sticky top-24">
								<h3 className="text-[16px] font-bold text-[#0F0F10] mb-4">Quick Links</h3>
								<nav className="space-y-2">
									{sections.map((section) => (
										<a
											key={section.title}
											href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
											className="block text-[13px] text-[#6B6B73] hover:text-[#EF4C5C] transition-colors py-1.5"
										>
											{section.title}
										</a>
									))}
								</nav>

								<div className="mt-6 pt-6 border-t border-[#F2F2F5]">
									<h4 className="text-[13px] font-semibold text-[#0F0F10] mb-3">Contact Privacy Team</h4>
									<p className="text-[12px] text-[#6B6B73] mb-2">privacy@cinetube.com</p>
									<Link href="/contact" className="text-[12px] text-[#EF4C5C] font-semibold hover:underline">
										Contact Us →
									</Link>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-9">
							<div className="space-y-12">
								{sections.map((section, idx) => {
									const Icon = section.icon;
									return (
										<section
											key={section.title}
											id={section.title.toLowerCase().replace(/\s+/g, "-")}
											className="scroll-mt-24"
										>
											<div className="flex items-center gap-3 mb-6">
												<div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#EF4C5C] flex items-center justify-center">
													<Icon className="w-5 h-5" />
												</div>
												<h2 className="text-[24px] font-bold text-[#0F0F10]">{section.title}</h2>
											</div>
											<div className="bg-white border border-[#F2F2F5] rounded-[18px] p-8">
												<ul className="space-y-3">
													{section.content.map((item) => (
														<li
															key={item}
															className="flex items-start gap-3 text-[14px] text-[#6B6B73] leading-relaxed"
														>
															<span className="text-[#EF4C5C] mt-0.5">•</span>
															{item}
														</li>
													))}
												</ul>
											</div>
										</section>
									);
								})}

								{/* Additional Legal Section */}
								<section id="legal-compliance" className="scroll-mt-24">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#EF4C5C] flex items-center justify-center">
											<Shield className="w-5 h-5" />
										</div>
										<h2 className="text-[24px] font-bold text-[#0F0F10]">Legal Compliance</h2>
									</div>
									<div className="bg-white border border-[#F2F2F5] rounded-[18px] p-8 space-y-4">
										<p className="text-[14px] text-[#6B6B73] leading-relaxed">
											CineTube complies with GDPR (General Data Protection Regulation) for European users and CCPA
											(California Consumer Privacy Act) for California residents. We are committed to providing you with
											control over your personal data.
										</p>
										<p className="text-[14px] text-[#6B6B73] leading-relaxed">
											For any privacy-related concerns or data requests, please contact our Data Protection Officer at{" "}
											<strong className="text-[#0F0F10]">dpo@cinetube.com</strong>.
										</p>
									</div>
								</section>

								{/* Update Notice */}
								<div className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-6 text-center">
									<p className="text-[13px] text-[#6B6B73]">
										This Privacy Policy is effective immediately. We may update this policy periodically. Significant
										changes will be notified via email or platform notification.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── CTA Section ── */}
			<section className="bg-[#EF4C5C] py-16">
				<div className="max-w-[1280px] mx-auto px-10 text-center">
					<h2 className="text-[28px] font-extrabold text-white mb-3">Have Questions About Your Privacy?</h2>
					<p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
						Our privacy team is here to help. Contact us anytime.
					</p>
					<div className="flex gap-3 justify-center flex-wrap">
						<Link
							href="/contact"
							className="bg-white text-[#EF4C5C] hover:bg-[#FAFAFA] rounded-[10px] px-6 py-2.5 font-semibold transition-colors"
						>
							Contact Privacy Team
						</Link>
						<Link
							href="/support"
							className="border border-white/40 text-white hover:bg-white/10 rounded-[10px] px-6 py-2.5 font-semibold transition-colors"
						>
							Visit Support Center
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PrivacyPolicyPage;
