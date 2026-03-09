import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/marketplace/components/marketplace-page";
import { servicesApi } from "@/services/api/services";
import { store } from "@/store";

export const Route = createFileRoute("/_main/services/")({
  component: () => <MarketplacePage forcedType="SERVICE" />,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    category?: string;
    categoryId?: string;
    companyId?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
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
      query: (search.query as string) || undefined,
      onlyInStock: (search.onlyInStock as boolean) || undefined,
      companyType: (search.companyType as string) || undefined,
      sortBy: (search.sortBy as string) || undefined,
      sortOrder: (search.sortOrder as string) || undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    const params = { page: 1, limit: 30, categoryId: deps.category };
    store.dispatch(servicesApi.endpoints.getServices.initiate(params));
  },
});
