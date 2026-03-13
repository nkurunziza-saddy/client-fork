import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { cn } from "@/lib/utils";
import { useGetProductsQuery } from "@/services/api/products";
import type { MarketplaceItem } from "@/types";
import { ProductCard } from "./catalog/product-card";

interface ProductListingViewProps {
  viewMode: "grid" | "list";
  isAuthenticated: boolean;
  wishlistIds: Set<string>;
  onToggleWishlist: (e: React.MouseEvent, item: MarketplaceItem) => void;
  onSupplierClick: (e: React.MouseEvent, companyId: string) => void;
  onProductClick: (item: MarketplaceItem) => void;
}

const PAGE_SIZE = 12;

export const ProductListingView: React.FC<ProductListingViewProps> = ({
  viewMode,
  isAuthenticated,
  wishlistIds,
  onToggleWishlist,
  onSupplierClick,
  onProductClick,
}) => {
  const { filters, patchFilters, resetFilters } = useMarketplaceFilters();

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

  const { data: productsData, isFetching } = useGetProductsQuery({
    ...sharedParams,
    inStock: filters.onlyInStock ? true : undefined,
  });

  const products = useMemo(
    () =>
      (productsData?.data || []).map((p) => ({
        ...p,
        itemType: "PRODUCT" as const,
      })),
    [productsData],
  );
  const meta = productsData?.meta;

  if (isFetching && products.length === 0) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-4 md:gap-6",
          viewMode === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={`skeleton-${i}`}
            className="h-80 border border-border/10 rounded-none"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {products.length === 0 ? (
        <div className="py-20 flex justify-center w-full">
          <Empty className="max-w-md w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2 className="w-4 h-4 text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-xl font-display font-black uppercase">
                No Products Found
              </EmptyTitle>
              <EmptyDescription className="uppercase tracking-widest text-[10px]">
                We couldn't find any products matching your current filters. Try
                adjusting your criteria.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={resetFilters}
                className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
              >
                Clear All Filters
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4 md:gap-6",
            viewMode === "grid"
              ? "grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              viewMode={viewMode}
              isInWishlist={isAuthenticated && wishlistIds.has(item.id)}
              onToggleWishlist={(e) => onToggleWishlist(e, item)}
              onSupplierClick={(e) => onSupplierClick(e, item.company.id)}
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 pt-8 border-t border-border/20">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
            disabled={filters.page <= 1}
            onClick={() => patchFilters({ page: filters.page - 1 })}
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Prev
          </Button>
          <span className="flex items-center px-4 text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground/30">
            {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
            disabled={filters.page >= meta.totalPages}
            onClick={() => patchFilters({ page: filters.page + 1 })}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
