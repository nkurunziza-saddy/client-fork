import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { CatalogFilters, ListingType } from "@/types";

const DEFAULT_PRICE_MAX = 1_000_000;

export function useMarketplaceFilters(
	_initialCategoryId = "all",
	_initialType: ListingType = "all",
	onTypeChange?: (type: ListingType) => void,
) {
	const search = useSearch({ strict: false }) as any;
	const navigate = useNavigate();

	const [searchInput, setSearchInput] = useState(search.searchQuery || "");
	const [priceRange, setPriceRange] = useState<[number, number]>([
		search.minPrice ? Number(search.minPrice) : 0,
		search.maxPrice ? Number(search.maxPrice) : DEFAULT_PRICE_MAX,
	]);

	// Sync state if filters change (e.g. from URL or reset)
	useEffect(() => {
		setSearchInput(search.searchQuery || "");
	}, [search.searchQuery]);

	useEffect(() => {
		setPriceRange([
			search.minPrice ? Number(search.minPrice) : 0,
			search.maxPrice ? Number(search.maxPrice) : DEFAULT_PRICE_MAX,
		]);
	}, [search.minPrice, search.maxPrice]);

	const patchFilters = useCallback(
		(patch: Partial<CatalogFilters>) => {
			navigate({
				search: (prev: any) => {
					const next = { ...prev, ...patch };
					if (patch.type != null && patch.type !== prev.type) {
						onTypeChange?.(patch.type as ListingType);
					}
					return next;
				},
			} as any);
		},
		[navigate, onTypeChange],
	);

	const resetFilters = useCallback(() => {
		navigate({
			search: (prev: any) => ({
				...prev,
				searchQuery: "",
				categoryId: "all",
				type: "all",
				district: "",
				minPrice: undefined,
				maxPrice: undefined,
				onlyInStock: false,
				companyType: "all",
				sortBy: "createdAt",
				sortOrder: "DESC",
				page: 1,
			}),
		} as any);
		onTypeChange?.("all");
	}, [navigate, onTypeChange]);

	const searchDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => {
		if (searchInput === (search.searchQuery || "")) return;

		clearTimeout(searchDebounce.current);
		searchDebounce.current = setTimeout(() => {
			navigate({
				search: (prev: any) => ({ ...prev, searchQuery: searchInput, page: 1 }),
			} as any);
		}, 400);
		return () => clearTimeout(searchDebounce.current);
	}, [searchInput, search.searchQuery, navigate]);

	const commitPrice = useCallback(() => {
		navigate({
			search: (prev: any) => ({
				...prev,
				minPrice: priceRange[0],
				maxPrice: priceRange[1],
				page: 1,
			}),
		} as any);
	}, [priceRange, navigate]);

	const hasActiveFilters =
		search.categoryId !== "all" ||
		search.type !== "all" ||
		search.companyType !== "all" ||
		!!search.district ||
		!!search.minPrice ||
		!!search.maxPrice ||
		search.onlyInStock;

	return {
		filters: search as CatalogFilters,
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
