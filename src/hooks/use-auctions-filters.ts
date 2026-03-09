import { useCallback, useEffect, useRef, useState } from "react";
import { useAuctionsParams } from "./use-auctions-params";

const DEFAULT_PRICE_MAX = 100_000_000;

export function useAuctionsFilters() {
  const [filters, setFilters] = useAuctionsParams();

  const [searchInput, setSearchInput] = useState(filters.q);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ? Number(filters.minPrice) : 0,
    filters.maxPrice ? Number(filters.maxPrice) : DEFAULT_PRICE_MAX,
  ]);

  // Sync state if filters change (e.g. from URL or reset)
  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  useEffect(() => {
    setPriceRange([
      filters.minPrice ? Number(filters.minPrice) : 0,
      filters.maxPrice ? Number(filters.maxPrice) : DEFAULT_PRICE_MAX,
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  const patchFilters = useCallback(
    (patch: Partial<typeof filters>) => {
      setFilters({ ...filters, ...patch });
    },
    [filters, setFilters],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      q: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
      page: 1,
    });
  }, [setFilters]);

  const searchDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (searchInput === filters.q) return; // Skip if already synced

    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setFilters({ q: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(searchDebounce.current);
  }, [searchInput, filters.q, setFilters]);

  const commitPrice = useCallback(() => {
    setFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      page: 1,
    });
  }, [priceRange, setFilters]);

  const hasActiveFilters =
    !!filters.q ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.sortBy !== "createdAt";

  return {
    filters,
    setFilters,
    patchFilters,
    resetFilters,
    searchInput,
    setSearchInput,
    priceRange,
    setPriceRange,
    commitPrice,
    hasActiveFilters,
  };
}
