import { useCallback, useTransition } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SupplierFiltersState } from "@/types";

export function useSupplierFilters() {
	const search = useSearch({ strict: false }) as any;
	const navigate = useNavigate();
	const [isPending, startTransition] = useTransition();

	const handleFiltersChange = useCallback(
		(updates: Partial<SupplierFiltersState>) => {
			startTransition(() => {
				navigate({
					search: (prev: any) => ({ ...prev, ...updates, page: 1 }),
				} as any);
			});
		},
		[navigate],
	);

	const handleClearFilters = useCallback(() => {
		startTransition(() => {
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
		});
	}, [navigate]);

	return {
		filters: search as SupplierFiltersState,
		handleFiltersChange,
		handleClearFilters,
		isPending,
	};
}
