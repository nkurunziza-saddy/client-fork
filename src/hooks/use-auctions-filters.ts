import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

const DEFAULT_PRICE_MAX = 100_000_000;

export function useAuctionsFilters() {
	const search = useSearch({ strict: false }) as any;
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
		(patch: Partial<any>) => {
			startTransition(() => {
				navigate({
					search: (prev: any) => ({ ...prev, ...patch }),
				} as any);
			});
		},
		[navigate],
	);

	const resetFilters = useCallback(() => {
		startTransition(() => {
			navigate({
				search: (prev: any) => ({
					...prev,
					q: "",
					minPrice: "",
					maxPrice: "",
					sortBy: "createdAt",
					sortOrder: "DESC",
					page: 1,
				}),
			} as any);
		});
	}, [navigate]);

	const searchDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => {
		if (searchInput === (search.q || "")) return;

		clearTimeout(searchDebounce.current);
		searchDebounce.current = setTimeout(() => {
			startTransition(() => {
				navigate({
					search: (prev: any) => ({ ...prev, q: searchInput, page: 1 }),
				} as any);
			});
		}, 400);
		return () => clearTimeout(searchDebounce.current);
	}, [searchInput, search.q, navigate]);

	const commitPrice = useCallback(() => {
		startTransition(() => {
			navigate({
				search: (prev: any) => ({
					...prev,
					minPrice: priceRange[0].toString(),
					maxPrice: priceRange[1].toString(),
					page: 1,
				}),
			} as any);
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
