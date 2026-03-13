import { createFileRoute, defer } from "@tanstack/react-router";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { store } from "@/store";
import { statsApi } from "@/services/api/stats";
import { companiesApi } from "@/services/api/companies";
import { productsApi } from "@/services/api/products";
import { servicesApi } from "@/services/api/services";

export const Route = createFileRoute("/admin/")({
	loader: async () => {
		// 1. Prefetch marketplace stats (critical for top summary)
		const statsPromise = store.dispatch(
			statsApi.endpoints.getMarketplaceStats.initiate(),
		).then(res => res.data);

		// 2. Defer larger lists for the rest of the dashboard
		const companiesPromise = store.dispatch(
			companiesApi.endpoints.getCompanies.initiate({
				limit: 100,
				sortBy: "createdAt",
				sortOrder: "DESC",
			}),
		).then(res => res.data);

		const productsPromise = store.dispatch(
			productsApi.endpoints.getProducts.initiate({
				limit: 100,
				sortBy: "createdAt",
				sortOrder: "DESC",
			}),
		).then(res => res.data);

		const servicesPromise = store.dispatch(
			servicesApi.endpoints.getServices.initiate({
				limit: 100,
				sortBy: "createdAt",
				sortOrder: "DESC",
			}),
		).then(res => res.data);

		return {
			stats: await statsPromise,
			deferred: defer(
				Promise.all([companiesPromise, productsPromise, servicesPromise]).then(
					([companies, products, services]) => ({
						companies,
						products,
						services,
					}),
				),
			),
		};
	},
	component: AdminDashboard,
});
