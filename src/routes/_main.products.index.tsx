import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { productsApi } from "@/services/api/products";
import { store } from "@/store";

type ProductsSearch = {
	category?: string;
};

export const Route = createFileRoute("/_main/products/")({
	component: () => <MarketplacePage forcedType="PRODUCT" />,
	validateSearch: (search: Record<string, unknown>): ProductsSearch => {
		return {
			category: (search.category as string) || undefined,
		};
	},
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => {
		const params = { page: 1, limit: 30, categoryId: deps.category };
		store.dispatch(productsApi.endpoints.getProducts.initiate(params));
	},
});
