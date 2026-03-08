export const ROLES = {
	ADMIN: "admin",
	AGENT: "agent",
	PROVIDER: "provider",
	USER: "user",
} as const;

export const LISTING_TYPES = {
	PRODUCT: "PRODUCT",
	SERVICE: "SERVICE",
	ALL: "all",
} as const;

export const PRICE_TYPES = {
	FIXED: "FIXED",
	NEGOTIABLE: "NEGOTIABLE",
	STARTS_AT: "STARTS_AT",
} as const;

export const STATUSES = {
	ACTIVE: "active",
	INACTIVE: "inactive",
	SUSPENDED: "suspended",
	PENDING: "pending",
	VERIFIED: "verified",
} as const;

export const APP_CONFIG = {
	NAME: "AfrikaMarket",
	SUPPORT_EMAIL: "support@afrikamarket.com",
	DEFAULT_PAGE_SIZE: 10,
} as const;
