import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { servicesApi } from "@/services/api/services";
import { store } from "@/store";

type ServicesSearch = {
	category?: string;
};

export const Route = createFileRoute("/_main/services/")({
	component: () => <MarketplacePage forcedType="SERVICE" />,
	validateSearch: (search: Record<string, unknown>): ServicesSearch => {
		return {
			category: (search.category as string) || undefined,
		};
	},
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => {
		const params = { page: 1, limit: 30, categoryId: deps.category };
		store.dispatch(servicesApi.endpoints.getServices.initiate(params));
	},
});
