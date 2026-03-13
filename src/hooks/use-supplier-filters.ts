import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SupplierFiltersState } from "@/types";

export function useSupplierFilters() {
	const search = useSearch({ strict: false }) as any;
	const navigate = useNavigate();

	const handleFiltersChange = useCallback(
		(updates: Partial<SupplierFiltersState>) => {
			navigate({
				search: (prev: any) => ({ ...prev, ...updates, page: 1 }),
			} as any);
		},
		[navigate],
	);

	const handleClearFilters = useCallback(() => {
		navigate({
			search: (prev: any) => ({
				...prev,
				searchQuery: "",
				categoryId: "all",
				district: "",
				type: "all",
				minRating: "0",
				verified: false,
				page: 1,
			}),
		} as any);
	}, [navigate]);

	return {
		filters: search as SupplierFiltersState,
		handleFiltersChange,
		handleClearFilters,
	};
}
