import { createFileRoute, defer } from "@tanstack/react-router";
import { DashboardSwitcher } from "@/features/dashboard/components/dashboard-switcher";
import { store } from "@/store";
import { companiesApi } from "@/services/api/companies";
import { productsApi } from "@/services/api/products";
import { servicesApi } from "@/services/api/services";
import { companyCategoriesApi } from "@/services/api/company-categories";
import { wishlistApi } from "@/services/api/wishlist";
import { messagesApi } from "@/services/api/messages";

export const Route = createFileRoute("/dashboard/")({
	loader: async () => {
		const { user } = store.getState().auth;
		const isProvider = user?.role === "provider";

		if (isProvider) {
			// 1. Critical data for providers
			const companyResult = await store.dispatch(
				companiesApi.endpoints.getMyCompany.initiate(),
			);
			const company = companyResult.data;

			// 2. Non-critical deferred data for providers
			const categoriesPromise = store
				.dispatch(
					companyCategoriesApi.endpoints.getCompanyCategories.initiate({
						limit: 100,
					}),
				)
				.then((res) => res.data);

			let productsPromise: Promise<any> = Promise.resolve({ data: [], meta: {} });
			let servicesPromise: Promise<any> = Promise.resolve({ data: [], meta: {} });

			if (company?.id) {
				productsPromise = store
					.dispatch(
						productsApi.endpoints.getProducts.initiate({
							companyId: company.id,
							limit: 100,
						}),
					)
					.then((res) => res.data ?? { data: [], meta: {} });

				servicesPromise = store
					.dispatch(
						servicesApi.endpoints.getServices.initiate({
							companyId: company.id,
							limit: 100,
						}),
					)
					.then((res) => res.data ?? { data: [], meta: {} });
			}

			return {
				isProvider: true,
				company,
				deferred: defer(
					Promise.all([
						categoriesPromise,
						productsPromise,
						servicesPromise,
					]).then(([categories, products, services]) => ({
						categories,
						products,
						services,
					})),
				),
			};
		}

		// Non-provider (User) dashboard
		const wishlistPromise = store
			.dispatch(wishlistApi.endpoints.getWishlist.initiate())
			.then((res) => res.data ?? []);

		const conversationsPromise = store
			.dispatch(messagesApi.endpoints.getConversations.initiate())
			.then((res) => res.data ?? []);

		return {
			isProvider: false,
			deferred: defer(
				Promise.all([wishlistPromise, conversationsPromise]).then(
					([wishlist, conversations]) => ({
						wishlist,
						conversations,
					}),
				),
			),
		};
	},
	component: DashboardSwitcher,
});
