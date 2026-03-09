import { SlidersHorizontal } from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { cn } from "@/lib/utils";
import { useGetCompanyCategoriesQuery } from "@/services/api/company-categories";
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { useGetServiceCategoriesQuery } from "@/services/api/service-categories";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import type { RootState } from "@/store";
import type { MarketplaceItem } from "@/types";
import { ActiveFilters } from "./active-filters";
import { CombinedView } from "./combined-view";
import { FilterPanel } from "./filter-panel";
import { MarketplaceToolbar } from "./marketplace-toolbar";
import { ProductListingView } from "./product-listing-view";
import { ServiceListingView } from "./service-listing-view";

interface MarketplaceGridProps {
  onSupplierClick?: (supplierId: string) => void;
  onProductClick?: (item: MarketplaceItem) => void;
  forcedType?: "PRODUCT" | "SERVICE";
}

const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  onSupplierClick,
  onProductClick,
  forcedType,
}) => {
  const {
    filters,
    patchFilters,
    resetFilters,
    searchInput,
    setSearchInput,
    priceRange,
    setPriceRange,
    commitPrice,
    hasActiveFilters,
  } = useMarketplaceFilters();

  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: prodCat } = useGetProductCategoriesQuery(
    { limit: 100 },
    { skip: (forcedType || filters.type) === "SERVICE" },
  );
  const { data: servCat } = useGetServiceCategoriesQuery(
    { limit: 100 },
    { skip: (forcedType || filters.type) === "PRODUCT" },
  );
  const { data: compCat } = useGetCompanyCategoriesQuery({ limit: 100 });

  const categories = useMemo(() => {
    const p = prodCat?.data ?? [];
    const s = servCat?.data ?? [];
    const c = compCat?.data ?? [];

    const currentType = forcedType || filters.type;

    if (currentType === "PRODUCT") return p;
    if (currentType === "SERVICE") return s;

    return [...c, ...p, ...s].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    );
  }, [prodCat, servCat, compCat, filters.type, forcedType]);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { data: wishlistRaw = [] } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const wishlistIds = useMemo(
    () =>
      new Set(
        Array.isArray(wishlistRaw)
          ? wishlistRaw.map((l: { id: string | number }) => String(l.id))
          : [],
      ),
    [wishlistRaw],
  );

  const handleSupplierClick = useCallback(
    (e: React.MouseEvent, companyId: string) => {
      e.stopPropagation();
      onSupplierClick?.(companyId);
    },
    [onSupplierClick],
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent, item: MarketplaceItem) => {
      e.stopPropagation();
      const type = item.itemType.toLowerCase() as "product" | "service";
      if (wishlistIds.has(item.id)) {
        removeFromWishlist({ id: item.id, type });
      } else {
        addToWishlist({ id: item.id, type });
      }
    },
    [wishlistIds, addToWishlist, removeFromWishlist],
  );

  const renderView = () => {
    const commonProps = {
      viewMode,
      showFilters,
      isAuthenticated,
      wishlistIds,
      onToggleWishlist: handleToggleWishlist,
      onSupplierClick: handleSupplierClick,
    };

    const currentType = forcedType || filters.type;

    if (currentType === "PRODUCT") {
      return (
        <ProductListingView
          {...commonProps}
          onProductClick={(item) => onProductClick?.(item)}
        />
      );
    }
    if (currentType === "SERVICE") {
      return (
        <ServiceListingView
          {...commonProps}
          onClick={(item) => onProductClick?.(item)}
        />
      );
    }
    return (
      <CombinedView
        {...commonProps}
        onProductClick={(item) => onProductClick?.(item)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border sticky top-[48px] z-30 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {" "}
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none">
                Marketplace
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-primary" />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
                  Supplier Directory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Filter Trigger */}
              <Drawer
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden rounded-none border-border/40 h-9 font-black uppercase text-[10px] tracking-widest"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-background flex flex-col">
                  <DrawerHeader className="p-6 border-b border-border/40 shrink-0 text-left">
                    <div className="flex items-center justify-between">
                      <DrawerTitle className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                        Market Filters
                      </DrawerTitle>
                    </div>
                  </DrawerHeader>
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <FilterPanel
                      filters={filters}
                      categories={categories}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      onPriceCommit={commitPrice}
                      onFilterChange={(p) => patchFilters(p)}
                    />
                  </div>
                  {hasActiveFilters && (
                    <div className="p-6 border-t border-border/40 shrink-0 bg-muted/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center h-10 text-[9px] uppercase font-black tracking-[0.2em] border border-destructive/20 text-destructive hover:bg-destructive/5"
                        onClick={() => {
                          resetFilters();
                          setIsMobileFiltersOpen(false);
                        }}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  )}
                </DrawerContent>
              </Drawer>

              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "hidden lg:flex rounded-none border-border/40 h-9 font-black uppercase text-[10px] tracking-widest",
                  showFilters &&
                    "bg-foreground text-background border-foreground hover:bg-foreground/90",
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {showFilters ? (
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50 pr-4">
                <h2 className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  Filters
                </h2>
                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-0 text-[8px] uppercase font-black tracking-widest text-muted-foreground/60 hover:text-destructive hover:bg-transparent"
                    onClick={resetFilters}
                  >
                    Clear All
                  </Button>
                ) : null}
              </div>
              <div className="pr-4">
                <FilterPanel
                  filters={filters}
                  categories={categories}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  onPriceCommit={commitPrice}
                  onFilterChange={patchFilters}
                />
              </div>
            </aside>
          ) : null}

          <div className="flex-1 min-w-0">
            <MarketplaceToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchInput}
              onSearchChange={setSearchInput}
            />

            <ActiveFilters
              filters={filters}
              categories={categories}
              onFilterChange={patchFilters}
            />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceGrid;
