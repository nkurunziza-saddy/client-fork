import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { marketplaceSearchSchema } from "@/features/marketplace/schemas";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { NotFound } from "@/shared/components/not-found";
import { createSeoMeta } from "@/shared/utils/seo";
import { productsApi } from "@/services/api/products";
import { store } from "@/store";

export const Route = createFileRoute("/_main/products/")({
	validateSearch: marketplaceSearchSchema,
	staleTime: 60_000, // 1 minute
	gcTime: 300_000, // 5 minutes
	component: () => <MarketplacePage forcedType="PRODUCT" from="/_main/products/" />,
	pendingComponent: RouteLoading,
	errorComponent: RouteError,
	notFoundComponent: NotFound,
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
	loaderDeps: ({ search }) => ({
		page: search.page,
		categoryId: search.categoryId || search.category,
		searchQuery: search.searchQuery,
		district: search.district,
		minPrice: search.minPrice,
		maxPrice: search.maxPrice,
		sortBy: search.sortBy,
		sortOrder: search.sortOrder,
	}),
	loader: ({ deps }) => {
		const params = {
			page: deps.page,
			limit: 30,
			categoryId: deps.categoryId,
			searchQuery: deps.searchQuery,
			district: deps.district,
			minPrice: deps.minPrice,
			maxPrice: deps.maxPrice,
			sortBy: deps.sortBy,
			sortOrder: deps.sortOrder as any,
		};
		return store.dispatch(productsApi.endpoints.getProducts.initiate(params));
	},
});
