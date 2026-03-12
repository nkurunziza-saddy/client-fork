import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { productsApi } from "@/services/api/products";
import { store } from "@/store";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/products/")({
	component: () => <MarketplacePage forcedType="PRODUCT" />,
	head: () =>
		createSeoMeta({
			title: "Wholesale Products Marketplace",
			description:
				"Browse our extensive catalog of quality wholesale products from across Africa. Find the best deals on electronics, fashion, food, and more.",
			keywords: [
				"wholesale products Africa",
				"African electronics wholesale",
				"African fashion suppliers",
				"wholesale food Africa",
			],
		}),
	validateSearch: (
		search: Record<string, unknown>,
	): {
		category?: string;
		categoryId?: string;
		companyId?: string;
		district?: string;
		minPrice?: number;
		maxPrice?: number;
		inStock?: boolean;
		query?: string;
		type?: string;
		searchQuery?: string;
		onlyInStock?: boolean;
		companyType?: string;
		sortBy?: string;
		sortOrder?: string;
	} => {
		return {
			category: (search.category as string) || undefined,
			categoryId: (search.categoryId as string) || undefined,
			type: (search.type as string) || undefined,
			searchQuery: (search.searchQuery as string) || undefined,
			district: (search.district as string) || undefined,
			minPrice: search.minPrice ? Number(search.minPrice) : undefined,
			maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
			onlyInStock: (search.onlyInStock as boolean) || undefined,
			companyType: (search.companyType as string) || undefined,
			sortBy: (search.sortBy as string) || undefined,
			sortOrder: (search.sortOrder as string) || undefined,
		};
	},
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => {
		const params = { page: 1, limit: 30, categoryId: deps.category };
		store.dispatch(productsApi.endpoints.getProducts.initiate(params));
	},
});
