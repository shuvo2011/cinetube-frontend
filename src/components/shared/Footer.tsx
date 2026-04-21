import Logo from "@/components/shared/Logo/Logo";
import Link from "next/link";

const footerLinks = {
	browse: [
		{ label: "Movies", href: "/movies" },
		{ label: "Series", href: "/series" },
		{ label: "Top Rated", href: "/movies?sort=rating&sortBy=averageRating&sortOrder=desc" },
		{ label: "New Releases", href: "/movies?sort=rating&sortBy=releaseYear&sortOrder=desc" },
	],
	account: [
		{ label: "Sign Up", href: "/register" },
		{ label: "Login", href: "/login" },
		{ label: "Forgot Password", href: "/forgot-password" },
		{ label: "Support", href: "/support" },
	],
	company: [
		{ label: "About Us", href: "/about" },
		{ label: "Contact", href: "/contact" },
		{ label: "Privacy Policy", href: "/privacy" },
		{ label: "Terms of Use", href: "/terms" },
	],
};

const Footer = () => {
	return (
		<footer className="border-t border-line-2 bg-bg">
			<div className="max-w-350 mx-auto px-6 md:px-10 py-12">
				{/* Top Grid */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand */}
					<div className="space-y-4">
						<Logo />
						<p className="text-sm text-text-muted leading-relaxed max-w-55">
							Your ultimate destination for movie ratings, honest reviews, and premium streaming.
						</p>
					</div>

					{/* Browse */}
					<div>
						<h4 className="text-xs font-semibold tracking-widest text-ink-2 uppercase mb-4">Browse</h4>
						<ul className="space-y-3">
							{footerLinks.browse.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-text-muted hover:text-ink transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Account */}
					<div>
						<h4 className="text-xs font-semibold tracking-widest text-ink-2 uppercase mb-4">Account</h4>
						<ul className="space-y-3">
							{footerLinks.account.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-text-muted hover:text-ink transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div>
						<h4 className="text-xs font-semibold tracking-widest text-ink-2 uppercase mb-4">Company</h4>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-text-muted hover:text-ink transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line-2 mt-10 pt-6">
					<span className="text-xs text-text-subtle">© {new Date().getFullYear()} CineTube. All rights reserved.</span>
					<span className="text-xs text-text-subtle">Terms &amp; Conditions · Privacy &amp; Policy</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
