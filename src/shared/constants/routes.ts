/**
 * Centralized route definitions for type-safety and reusability
 */
export const ROUTES = {
	HOME: "/",
	ABOUT: "/about",
	HELP: "/help",
	AUTH: {
		SIGNIN: "/auth/signin",
		SIGNUP: "/auth/signup",
		VERIFY_EMAIL: "/auth/verify-email",
	},
	PROTECTED: {
		PROFILE: "/profile",
		MESSAGES: "/messages",
		WISHLIST: "/wishlist",
		ONBOARDING: "/onboarding",
	},
	DASHBOARD: {
		INDEX: "/dashboard",
		AUCTIONS: {
			INDEX: "/dashboard/auctions",
			NEW: "/dashboard/auctions/new",
		},
		LISTINGS: {
			INDEX: "/dashboard/listings",
			NEW: "/dashboard/listings/new",
			EDIT: (id: string) => `/dashboard/listings/${id}/edit` as const,
		},
	},
	ADMIN: {
		INDEX: "/admin",
		AUCTIONS: "/admin/auctions",
		SUPPLIERS: {
			INDEX: "/admin/suppliers",
			NEW: "/admin/suppliers/new",
			DETAILS: (id: string) => `/admin/suppliers/${id}` as const,
			EDIT: (id: string) => `/admin/suppliers/${id}/edit` as const,
		},
		PRODUCTS: "/admin/products",
		SERVICES: "/admin/services",
		CATEGORIES: "/admin/categories",
		BUYERS: "/admin/buyers",
		ASSIGNMENTS: "/admin/assignments",
		PROFILE: "/admin/profile",
	},
	PUBLIC: {
		PRODUCTS: "/products",
		SERVICES: "/services",
		SUPPLIERS: "/suppliers",
		AUCTIONS: "/auctions",
		CATEGORIES: "/categories",
		PRODUCT: (id: string) => `/products/${id}` as const,
		SERVICE: (id: string) => `/services/${id}` as const,
		SUPPLIER: (id: string) => `/suppliers/${id}` as const,
	},
} as const;
