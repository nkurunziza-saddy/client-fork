import type React from "react";
import { useMemo } from "react";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { useGetProductsQuery } from "@/services/api/products";
import { useGetServicesQuery } from "@/services/api/services";
import type { MarketplaceItem } from "@/types";
import { ProductCard } from "./catalog/product-card";
import { ServiceCard } from "./catalog/service-card";

const PAGE_SIZE = 30;

interface CombinedViewProps {
  viewMode: "grid" | "list";
  isAuthenticated: boolean;
  wishlistIds: Set<string>;
  onToggleWishlist: (e: React.MouseEvent, item: MarketplaceItem) => void;
  onSupplierClick: (e: React.MouseEvent, companyId: string) => void;
  onProductClick: (item: MarketplaceItem) => void;
}

export const CombinedView: React.FC<CombinedViewProps> = ({
  viewMode,
  isAuthenticated,
  wishlistIds,
  onToggleWishlist,
  onSupplierClick,
  onProductClick,
}) => {
  const { filters } = useMarketplaceFilters();

  const sharedParams = useMemo(
    () => ({
      page: filters.page,
      limit: PAGE_SIZE,
      query: (filters.searchQuery || "").trim() || undefined,
      categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
      district: (filters.district || "").trim() || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      companyType:
        filters.companyType === "all" ? undefined : filters.companyType,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder as "ASC" | "DESC" | undefined,
    }),
    [filters],
  );

  const { data: productsData, isFetching: productsFetching } =
    useGetProductsQuery({
      ...sharedParams,
      inStock: filters.onlyInStock ? true : undefined,
    });

  const { data: servicesData, isFetching: servicesFetching } =
    useGetServicesQuery(sharedParams);

  const products = useMemo(
    () =>
      (productsData?.data || []).map((p) => ({
        ...p,
        itemType: "PRODUCT" as const,
      })),
    [productsData],
  );

  const services = useMemo(
    () =>
      (servicesData?.data || []).map((s) => ({
        ...s,
        itemType: "SERVICE" as const,
      })),
    [servicesData],
  );

  const allItems = useMemo(() => {
    return [...products, ...services].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [products, services]);

  if ((productsFetching || servicesFetching) && allItems.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-80 bg-muted/10 border border-border/10 rounded-none animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          : "flex flex-col gap-6"
      }
    >
      {allItems.map((item) => {
        const cardProps = {
          viewMode,
          isInWishlist: isAuthenticated && wishlistIds.has(item.id),
          onToggleWishlist: (e: React.MouseEvent) => onToggleWishlist(e, item),
          onSupplierClick: (e: React.MouseEvent) =>
            onSupplierClick(e, item.company.id),
          onClick: () => onProductClick(item),
        };

        return (
          <div
            key={item.id}
            className={
              viewMode === "grid"
                ? "w-full"
                : "w-full border-b border-border/40 pb-6 last:border-0"
            }
          >
            {(() => {
              if (item.itemType === "PRODUCT") {
                return <ProductCard {...cardProps} product={item} />;
              }
              return <ServiceCard {...cardProps} service={item} />;
            })()}
          </div>
        );
      })}
    </div>
  );
};
