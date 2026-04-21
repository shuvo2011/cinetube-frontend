import {
	LayoutDashboard,
	Film,
	MessageSquare,
	Tag,
	Globe,
	Users,
	ShieldCheck,
	Heart,
	CreditCard,
	BadgeDollarSign,
	BarChart2,
	Settings,
	User,
	Star,
	Bookmark,
	Receipt,
	LucideIcon,
	MessageCircle,
	UserStar,
	Tags,
	ClipboardList,
} from "lucide-react";

export type NavItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	badge?: number;
	badgeVariant?: "red" | "amber";
};

export type NavSection = {
	title: string;
	items: NavItem[];
};

// ------------------------------------------------------------------
// ADMIN nav sections
// ------------------------------------------------------------------
export const adminNavSections: NavSection[] = [
	{
		title: "Overview",
		items: [{ title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
	},
	{
		title: "Content",
		items: [
			{ title: "Movies & Series", href: "/admin/dashboard/movies", icon: Film },
			{ title: "Movie Casts", href: "/admin/dashboard/cast-members", icon: UserStar },
			{
				title: "Reviews",
				href: "/admin/dashboard/reviews",
				icon: MessageSquare,
			},
			{
				title: "Comments",
				href: "/admin/dashboard/comments",
				icon: MessageCircle,
			},
			{ title: "Genres", href: "/admin/dashboard/genres", icon: ClipboardList },
			{ title: "Platforms", href: "/admin/dashboard/platforms", icon: Globe },
			{ title: "Tags", href: "/admin/dashboard/tags", icon: Tags },
		],
	},
	{
		title: "Users",
		items: [
			{ title: "All Users", href: "/admin/dashboard/users", icon: Users },
			{ title: "Watchlists", href: "/admin/dashboard/watchlists", icon: Heart },
		],
	},
	{
		title: "Finance",
		items: [
			{
				title: "Payments",
				href: "/admin/dashboard/payments",
				icon: CreditCard,
				badge: 3,
				badgeVariant: "amber",
			},
			{
				title: "Subscriptions",
				href: "/admin/dashboard/subscriptions",
				icon: BadgeDollarSign,
			},
		],
	},
	{
		title: "Settings",
		items: [{ title: "My Profile", href: "/admin/dashboard/profile", icon: User }],
	},
];

// ------------------------------------------------------------------
// USER nav sections
// ------------------------------------------------------------------
export const userNavSections: NavSection[] = [
	{
		title: "Overview",
		items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
	},
	{
		title: "My Activity",
		items: [
			{ title: "My Reviews", href: "/dashboard/my-reviews", icon: Star },
			{ title: "Watchlist", href: "/dashboard/watchlist", icon: Bookmark },
		],
	},
	{
		title: "Billing",
		items: [{ title: "My Payments", href: "/dashboard/my-payments", icon: Receipt }],
	},
	{
		title: "Account",
		items: [
			{ title: "My Profile", href: "/dashboard/profile", icon: User },
			{ title: "Settings", href: "/dashboard/settings", icon: Settings },
		],
	},
];
