import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { marketplaceSearchSchema } from "@/features/marketplace/schemas";
import { servicesApi } from "@/services/api/services";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { createSeoMeta } from "@/shared/utils/seo";
import { store } from "@/store";

export const Route = createFileRoute("/_main/services/")({
  validateSearch: marketplaceSearchSchema,
  staleTime: 60_000,
  gcTime: 300_000,
  component: () => (
    <MarketplacePage forcedType="SERVICE" from="/_main/services/" />
  ),
  pendingComponent: RouteLoading,
  errorComponent: RouteError,
  notFoundComponent: NotFound,
  head: () =>
    createSeoMeta({
      title: "Wholesale Services Marketplace",
      description:
        "Connect with professional services for your construction and wholesale business. Find electrical, plumbing, engineering, and logistics experts.",
      keywords: [
        "construction services Africa",
        "wholesale business services",
        "African engineering services",
        "logistics services Africa",
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
      sortOrder: deps.sortOrder,
    };
    return store.dispatch(servicesApi.endpoints.getServices.initiate(params));
  },
});
