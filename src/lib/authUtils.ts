export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export const isAuthRoute = (pathname: string) => {
	return authRoutes.some((route) => route === pathname);
};

type RouteConfig = {
	exact: string[];
	pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
	exact: ["/profile", "/change-password"],
	pattern: [],
};

export const adminProtectedRoutes: RouteConfig = {
	pattern: [/^\/dashboard\/admin/],
	exact: [],
};

export const userProtectedRoutes: RouteConfig = {
	pattern: [/^\/dashboard/],
	exact: ["/watchlist", "/my-reviews", "/my-payments"],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
	if (routes.exact.includes(pathname)) return true;
	return routes.pattern.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): "ADMIN" | "USER" | "COMMON" | null => {
	if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
	if (isRouteMatches(pathname, userProtectedRoutes)) return "USER";
	if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
	return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
	if (role === "ADMIN" || role === "SUPER_ADMIN") return "/dashboard/admin";
	return "/dashboard";
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
	const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
	const normalizedRole = unifySuperAdminAndAdminRole;
	const routeOwner = getRouteOwner(redirectPath);
	if (routeOwner === null || routeOwner === "COMMON") return true;
	return routeOwner === normalizedRole;
};
