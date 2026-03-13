import { z } from "zod";

export const marketplaceSearchSchema = z.object({
	category: z.string().optional(),
	categoryId: z.string().optional(),
	companyId: z.string().optional(),
	district: z.string().optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	inStock: z.boolean().optional(),
	query: z.string().optional(),
	type: z.string().optional().default("all"),
	searchQuery: z.string().optional().default(""),
	onlyInStock: z.boolean().optional().default(false),
	companyType: z.string().optional().default("all"),
	sortBy: z.string().optional().default("createdAt"),
	sortOrder: z.string().optional().default("DESC"),
	page: z.number().optional().default(1),
});

export type MarketplaceSearch = z.infer<typeof marketplaceSearchSchema>;

export const auctionSearchSchema = z.object({
	q: z.string().optional().default(""),
	minPrice: z.string().optional().default(""),
	maxPrice: z.string().optional().default(""),
	sortBy: z.string().optional().default("createdAt"),
	sortOrder: z.string().optional().default("DESC"),
	page: z.number().optional().default(1),
});

export type AuctionSearch = z.infer<typeof auctionSearchSchema>;

export const suppliersSearchSchema = z.object({
	searchQuery: z.string().optional().default(""),
	categoryId: z.string().optional().default("all"),
	district: z.string().optional().default(""),
	type: z.string().optional().default("all"),
	minRating: z.string().optional().default("0"),
	verified: z.boolean().optional().default(false),
	page: z.number().optional().default(1),
});

export type SuppliersSearch = z.infer<typeof suppliersSearchSchema>;
