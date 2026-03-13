import { createFileRoute, defer } from "@tanstack/react-router";
import ProviderDashboard from "@/features/dashboard/components/provider-dashboard";
import { companiesApi } from "@/services/api/companies";
import { companyCategoriesApi } from "@/services/api/company-categories";
import {
  productsApi,
  type NormalizedProductsResult,
} from "@/services/api/products";
import {
  servicesApi,
  type NormalizedServicesResult,
} from "@/services/api/services";
import { store } from "@/store";
import type { CompanyCategoriesListResult, Product, Service } from "@/types";

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
      .then((res) => res.data as CompanyCategoriesListResult);

    let productsPromise: Promise<
      | NormalizedProductsResult
      | { data: Product[]; meta: { totalPages: number } }
    > = Promise.resolve({ data: [], meta: { totalPages: 0 } });
    let servicesPromise: Promise<
      | NormalizedServicesResult
      | { data: Service[]; meta: { totalPages: number } }
    > = Promise.resolve({ data: [], meta: { totalPages: 0 } });

    if (company?.id) {
      productsPromise = store
        .dispatch(
          productsApi.endpoints.getProducts.initiate({
            companyId: company.id,
            limit: 100,
          }),
        )
        .then(
          (res) =>
            (res.data ?? {
              data: [],
              meta: { totalPages: 0, total: 0, page: 1, limit: 100 },
            }) as NormalizedProductsResult,
        );

      servicesPromise = store
        .dispatch(
          servicesApi.endpoints.getServices.initiate({
            companyId: company.id,
            limit: 100,
          }),
        )
        .then(
          (res) =>
            (res.data ?? {
              data: [],
              meta: { totalPages: 0, total: 0, page: 1, limit: 100 },
            }) as NormalizedServicesResult,
        );
    }

    return {
      company,
      deferred: defer(
        Promise.all([categoriesPromise, productsPromise, servicesPromise]).then(
          ([categories, products, services]) => ({
            categories,
            products,
            services,
          }),
        ),
      ),
    };
  },
  component: () => {
    const { company, deferred } = Route.useLoaderData();
    return (
      <ProviderDashboard
        initialCompany={company ?? undefined}
        deferred={deferred as never} // ProviderDashboard expects exactly the output of the promise
      />
    );
  },
});
