import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuctionsFilters } from "@/hooks/use-auctions-filters";
import {
  ActiveFilterBadges,
  type FilterBadgeItem,
} from "@/shared/components/active-filter-badges";
import { MarketplaceLayout } from "@/shared/components/layouts/marketplace-layout";
import { AuctionsGrid } from "./auctions-grid";
import { MarketplaceToolbar } from "@/features/marketplace/components/marketplace-toolbar";

interface SortSelectProps {
  className?: string;
  sortValue: string;
  onSortChange: (val: string | null) => void;
  options: { label: string; value: string }[];
}

const SortSelect = ({
  className,
  sortValue,
  onSortChange,
  options,
}: SortSelectProps) => (
  <Select value={sortValue} onValueChange={onSortChange}>
    <SelectTrigger
      className={cn(
        "h-10 rounded-none border-border/40 bg-muted/10 font-bold uppercase tracking-wider text-[10px] gap-2 px-3",
        className,
      )}
    >
      <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent className="rounded-none border-border/40 shadow-xl">
      {options.map((opt) => (
        <SelectItem
          key={opt.value}
          value={opt.value}
          className="text-[10px] font-bold uppercase"
        >
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function AuctionsPage() {
  const { searchInput, setSearchInput, filters, patchFilters, isPending } =
    useAuctionsFilters();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortValue = `${filters.sortBy}-${filters.sortOrder}`;
  const handleSortChange = (val: string | null) => {
    const [sortBy, sortOrder] = (val || "-").split("-");
    patchFilters({ sortBy, sortOrder });
  };

  const sortOptions = [
    { label: "Newest First", value: "createdAt-DESC" },
    { label: "Oldest First", value: "createdAt-ASC" },
    { label: "Price: Low to High", value: "startingPrice-ASC" },
    { label: "Price: High to Low", value: "startingPrice-DESC" },
  ];

  const badgeItems = useMemo<FilterBadgeItem[]>(() => {
    const items: FilterBadgeItem[] = [];

    if (filters.q) {
      items.push({
        id: "search",
        label: `Search: ${filters.q}`,
        onRemove: () => patchFilters({ q: "" }),
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      items.push({
        id: "price",
        label: `Price: ${filters.minPrice || 0} - ${filters.maxPrice || "Max"}`,
        onRemove: () =>
          patchFilters({ minPrice: undefined, maxPrice: undefined }),
      });
    }

    return items;
  }, [filters, patchFilters]);

  const toolbar = (
    <MarketplaceToolbar
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      searchQuery={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="SEARCH AUCTIONS..."
      className="flex-1"
    >
      <div className="hidden md:flex items-center">
        <SortSelect
          sortValue={sortValue}
          onSortChange={handleSortChange}
          options={sortOptions}
          className="w-[180px]"
        />
      </div>
    </MarketplaceToolbar>
  );

  const mobileFilters = (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Sort By
      </p>
      <SortSelect
        className="w-full"
        sortValue={sortValue}
        onSortChange={handleSortChange}
        options={sortOptions}
      />
    </div>
  );

  return (
    <MarketplaceLayout
      title="Auctions"
      subtitle="Live Bidding Events"
      showFilters={false}
      hasActiveFilters={badgeItems.length > 0}
      onToggleFilters={() => {}}
      onResetFilters={() =>
        patchFilters({
          q: "",
          minPrice: undefined,
          maxPrice: undefined,
          sortBy: "createdAt",
          sortOrder: "DESC",
        })
      }
      isMobileFiltersOpen={isMobileFiltersOpen}
      setIsMobileFiltersOpen={setIsMobileFiltersOpen}
      isPending={isPending}
      activeFilters={<ActiveFilterBadges items={badgeItems} />}
      toolbar={toolbar}
      mobileFilters={mobileFilters}
      content={
        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AuctionsGrid />
          </div>
        </div>
      }
    />
  );
}
