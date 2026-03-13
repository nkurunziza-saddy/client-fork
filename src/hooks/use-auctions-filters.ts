import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const DEFAULT_PRICE_MAX = 100_000_000;

export function useAuctionsFilters() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(search.q || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    search.minPrice ? Number(search.minPrice) : 0,
    search.maxPrice ? Number(search.maxPrice) : DEFAULT_PRICE_MAX,
  ]);

  // Sync state if filters change (e.g. from URL or reset)
  useEffect(() => {
    setSearchInput(search.q || "");
  }, [search.q]);

  useEffect(() => {
    setPriceRange([
      search.minPrice ? Number(search.minPrice) : 0,
      search.maxPrice ? Number(search.maxPrice) : DEFAULT_PRICE_MAX,
    ]);
  }, [search.minPrice, search.maxPrice]);

  const patchFilters = useCallback(
    (patch: Record<string, unknown>) => {
      startTransition(() => {
        navigate({
          search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }),
        } as never);
      });
    },
    [navigate],
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          q: "",
          minPrice: "",
          maxPrice: "",
          sortBy: "createdAt",
          sortOrder: "DESC",
          page: 1,
        })) as never,
      });
    });
  }, [navigate]);

  const searchDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (searchInput === (search.q || "")) return;

    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      startTransition(() => {
        navigate({
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            q: searchInput,
            page: 1,
          }),
        } as never);
      });
    }, 400);
    return () => clearTimeout(searchDebounce.current);
  }, [searchInput, search.q, navigate]);

  const commitPrice = useCallback(() => {
    startTransition(() => {
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
          page: 1,
        })) as never,
      });
    });
  }, [priceRange, navigate]);

  const hasActiveFilters =
    !!search.q ||
    !!search.minPrice ||
    !!search.maxPrice ||
    search.sortBy !== "createdAt";

  return {
    filters: search,
    patchFilters,
    resetFilters,
    searchInput,
    setSearchInput,
    priceRange,
    setPriceRange,
    commitPrice,
    hasActiveFilters,
    isPending,
  };
}
