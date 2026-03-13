import { createFileRoute, defer } from "@tanstack/react-router";
import ProviderDashboard from "@/features/dashboard/components/provider-dashboard";
import { store } from "@/store";
import { companiesApi } from "@/services/api/companies";
import { productsApi } from "@/services/api/products";
import { servicesApi } from "@/services/api/services";
import { companyCategoriesApi } from "@/services/api/company-categories";

export const Route = createFileRoute("/dashboard/listings/")({
	loader: async () => {
		const companyResult = await store.dispatch(
			companiesApi.endpoints.getMyCompany.initiate(),
		);
		const company = companyResult.data;

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
	},
	component: () => {
		const { company, deferred } = Route.useLoaderData();
		return <ProviderDashboard initialCompany={company ?? undefined} deferred={deferred} />;
	},
});
