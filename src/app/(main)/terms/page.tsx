import Link from "next/link";
import {
	FileText,
	CheckCircle,
	AlertCircle,
	CreditCard,
	Users,
	Shield,
	Ban,
	RefreshCw,
	Lock,
	MessageSquare,
	Star,
} from "lucide-react";

export const metadata = {
	title: "Terms of Use - Rules & Guidelines | CineTube",
	description:
		"Read and understand the terms and conditions for using CineTube. Learn about your rights, responsibilities, and our policies for ratings, reviews, and subscriptions.",
};

const sections = [
	{
		icon: FileText,
		title: "Acceptance of Terms",
		content: [
			"By accessing or using CineTube, you agree to be bound by these Terms of Use",
			"If you disagree with any part of these terms, you may not access the platform",
			"We reserve the right to modify these terms at any time",
			"Continued use after changes constitutes acceptance of new terms",
			"Users under 18 require parental consent to use CineTube",
		],
	},
	{
		icon: Users,
		title: "User Accounts",
		content: [
			"You must provide accurate and complete information when creating an account",
			"You are responsible for maintaining account security and password confidentiality",
			"Notify us immediately of any unauthorized account access",
			"One person may not maintain multiple accounts",
			"We reserve the right to suspend or terminate accounts violating these terms",
		],
	},
	{
		icon: Star,
		title: "Ratings & Reviews Guidelines",
		content: [
			"Rate movies and series on a genuine 1-10 scale based on your actual viewing experience",
			"Reviews must be original, honest, and not contain spoilers without warning tags",
			"No fake ratings, review bombing, or coordinated rating manipulation",
			"Do not post spam, promotional content, or irrelevant reviews",
			"Hate speech, harassment, or personal attacks in reviews are strictly prohibited",
			"Reviews that violate guidelines may be removed and accounts penalized",
		],
	},
	{
		icon: CreditCard,
		title: "Subscriptions & Payments",
		content: [
			"Monthly and yearly subscriptions auto-renew unless cancelled before renewal date",
			"Rental periods begin at time of purchase and expire after specified duration",
			"Purchased content is available indefinitely in your library",
			"Refunds are provided only in cases of technical issues, not for change of mind",
			"Prices may change with 30 days notice via email",
			"All transactions are in USD unless specified otherwise",
		],
	},
	{
		icon: MessageSquare,
		title: "User Conduct",
		content: [
			"Do not post copyrighted content without permission",
			"No sharing of account credentials with others",
			"Do not attempt to bypass geo-restrictions or DRM protection",
			"No harvesting user data or sending unsolicited messages",
			"Do not upload malware or attempt to hack the platform",
			"Respect other users and their opinions in discussions",
		],
	},
	{
		icon: Shield,
		title: "Content Ownership",
		content: [
			"Movie and series content is owned by respective copyright holders",
			"Your reviews and ratings remain your property but grant CineTube license to display them",
			"You may request review deletion at any time from your dashboard",
			"CineTube logos and branding are our intellectual property",
			"Do not reproduce, distribute, or modify our platform content without permission",
		],
	},
	{
		icon: Ban,
		title: "Account Termination",
		content: [
			"You may delete your account anytime from dashboard settings",
			"We may suspend accounts for violating these terms",
			"Repeated review guideline violations lead to permanent ban",
			"Fraudulent payment activity results in immediate termination",
			"Upon termination, access to purchased content is lost",
			"Reviews may remain visible but attributed to 'Deleted User'",
		],
	},
	{
		icon: AlertCircle,
		title: "Disclaimer of Warranties",
		content: [
			"CineTube is provided 'as is' without warranties of uninterrupted service",
			"We don't guarantee all movies/series will always be available",
			"Streaming quality depends on your internet connection",
			"We aren't responsible for third-party content or external links",
			"User reviews represent opinions, not factual statements",
		],
	},
	{
		icon: Lock,
		title: "Limitation of Liability",
		content: [
			"CineTube isn't liable for indirect or consequential damages",
			"Maximum liability is limited to amount paid in last 6 months",
			"We aren't responsible for data loss due to account termination",
			"No liability for service interruptions due to maintenance or emergencies",
		],
	},
];

const TermsOfUsePage = () => {
	return (
		<div className="bg-white min-h-screen">
			<section className="bg-[#FEF2F2] py-20 relative overflow-hidden">
				<div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />
				<div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#EF4C5C]/5 pointer-events-none" />

				<div className="max-w-[1280px] mx-auto px-10 relative z-10 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-5">
						<FileText className="w-3.5 h-3.5 text-[#EF4C5C]" />
						<span>Legal Agreement</span>
					</div>

					<h1 className="text-[56px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-[1.02] mb-6">
						Terms of <em className="not-italic text-[#EF4C5C]">Use</em>
					</h1>

					<p className="text-[17px] text-[#6B6B73] max-w-2xl mx-auto mb-6 leading-relaxed">
						Welcome to CineTube! By using our platform to rate, review, and stream movies and TV series, you agree to
						these terms. Please read them carefully before creating an account.
					</p>

					<p className="text-[13px] text-[#6B6B73]">
						Effective: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
					</p>
				</div>
			</section>

			<section className="bg-white border-b border-[#F2F2F5] sticky top-0 z-10">
				<div className="max-w-[1280px] mx-auto px-10 py-4">
					<div className="flex flex-wrap gap-2 justify-center">
						{sections.map((section) => (
							<a
								key={section.title}
								href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
								className="text-[12px] text-[#6B6B73] hover:text-[#EF4C5C] transition-colors px-3 py-1.5 rounded-full hover:bg-[#FEF2F2]"
							>
								{section.title}
							</a>
						))}
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="max-w-[1280px] mx-auto px-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
									<h4 className="text-[13px] font-semibold text-[#0F0F10] mb-3">Questions?</h4>
									<p className="text-[12px] text-[#6B6B73] mb-2">legal@cinetube.com</p>
									<Link href="/contact" className="text-[12px] text-[#EF4C5C] font-semibold hover:underline">
										Contact Legal Team →
									</Link>
								</div>
							</div>
						</div>

						<div className="lg:col-span-9">
							<div className="space-y-8">
								{sections.map((section) => {
									const Icon = section.icon;
									return (
										<section
											key={section.title}
											id={section.title.toLowerCase().replace(/\s+/g, "-")}
											className="scroll-mt-24"
										>
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#EF4C5C] flex items-center justify-center">
													<Icon className="w-5 h-5" />
												</div>
												<h2 className="text-[22px] font-bold text-[#0F0F10]">{section.title}</h2>
											</div>
											<div className="bg-white border border-[#F2F2F5] rounded-[18px] p-6">
												<ul className="space-y-2.5">
													{section.content.map((item) => (
														<li
															key={item}
															className="flex items-start gap-3 text-[14px] text-[#6B6B73] leading-relaxed"
														>
															<CheckCircle className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
															{item}
														</li>
													))}
												</ul>
											</div>
										</section>
									);
								})}

								<section id="governing-law" className="scroll-mt-24">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#EF4C5C] flex items-center justify-center">
											<Shield className="w-5 h-5" />
										</div>
										<h2 className="text-[22px] font-bold text-[#0F0F10]">Governing Law</h2>
									</div>
									<div className="bg-white border border-[#F2F2F5] rounded-[18px] p-6">
										<p className="text-[14px] text-[#6B6B73] leading-relaxed">
											These terms are governed by the laws of the State of California, without regard to conflict of law
											principles. Any disputes arising from these terms or your use of CineTube shall be resolved
											through binding arbitration in Los Angeles, California, rather than in court. You waive the right
											to participate in class actions.
										</p>
									</div>
								</section>

								<div className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-6 text-center">
									<RefreshCw className="w-8 h-8 text-[#EF4C5C] mx-auto mb-3" />
									<p className="text-[13px] text-[#6B6B73]">
										For any questions about these Terms of Use, please contact us at:
										<br />
										<strong className="text-[#0F0F10]">legal@cinetube.com</strong> or
										<strong className="text-[#0F0F10]"> +1 (800) 123-4567</strong>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-[#EF4C5C] py-16">
				<div className="max-w-[1280px] mx-auto px-10 text-center">
					<h2 className="text-[28px] font-extrabold text-white mb-3">By Using CineTube, You Agree to These Terms</h2>
					<p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
						Ready to start rating and watching? Create your account today.
					</p>
					<div className="flex gap-3 justify-center flex-wrap">
						<Link
							href="/register"
							className="bg-white text-[#EF4C5C] hover:bg-[#FAFAFA] rounded-[10px] px-6 py-2.5 font-semibold transition-colors"
						>
							Create Free Account
						</Link>
						<Link
							href="/privacy"
							className="border border-white/40 text-white hover:bg-white/10 rounded-[10px] px-6 py-2.5 font-semibold transition-colors"
						>
							Read Privacy Policy
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default TermsOfUsePage;
