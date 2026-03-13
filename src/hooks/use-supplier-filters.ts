import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useTransition } from "react";
import type { SupplierFiltersState } from "@/types";

export function useSupplierFilters() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const handleFiltersChange = useCallback(
    (updates: Partial<SupplierFiltersState>) => {
      startTransition(() => {
        navigate({
          search: ((prev: Record<string, unknown>) => ({
            ...prev,
            ...updates,
            page: 1,
          })) as never,
        });
      });
    },
    [navigate],
  );

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          searchQuery: "",
          categoryId: "all",
          district: "",
          type: "all",
          minRating: "0",
          verified: false,
          page: 1,
        })) as never,
      });
    });
  }, [navigate]);

  return {
    filters: search as SupplierFiltersState,
    handleFiltersChange,
    handleClearFilters,
    isPending,
  };
}
