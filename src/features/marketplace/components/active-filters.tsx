import { memo, useMemo } from "react";
import {
	ActiveFilterBadges,
	type FilterBadgeItem,
} from "@/shared/components/active-filter-badges";
import type { CatalogFilters } from "@/types";

const COMPANY_TYPES = [
	{ value: "SUPPLIER_DEALER", label: "Dealer" },
	{ value: "SUPPLIER_RETAILER", label: "Retailer" },
	{ value: "SUPPLIER_WHOLESALER", label: "Wholesaler/Importer" },
	{ value: "MANUFACTURER_RWANDA", label: "Factory (Rwanda)" },
	{ value: "MANUFACTURER_EAC", label: "Factory (EAC)" },
	{ value: "SERVICE_PROVIDER", label: "Service Provider" },
] as const;

const DEFAULT_PRICE_MAX = 1_000_000;

interface ActiveFiltersProps {
	filters: CatalogFilters;
	categories: Array<{ id: string; name: string }>;
	onFilterChange: (patch: Partial<CatalogFilters>) => void;
}

export const ActiveFilters = memo<ActiveFiltersProps>(
	({ filters, categories, onFilterChange }) => {
		const badgeItems = useMemo<FilterBadgeItem[]>(() => {
			const items: FilterBadgeItem[] = [];

			if (filters.categoryId !== "all") {
				items.push({
					id: "category",
					label:
						categories.find((c) => c.id === filters.categoryId)?.name ??
						"Category",
					onRemove: () => onFilterChange({ categoryId: "all", page: 1 }),
				});
			}

			if (filters.companyType !== "all") {
				items.push({
					id: "companyType",
					label:
						COMPANY_TYPES.find((t) => t.value === filters.companyType)?.label ??
						filters.companyType,
					onRemove: () => onFilterChange({ companyType: "all", page: 1 }),
				});
			}

			if (filters.type !== "all") {
				items.push({
					id: "type",
					label: filters.type === "PRODUCT" ? "Products" : "Services",
					onRemove: () => onFilterChange({ type: "all", page: 1 }),
				});
			}

			if (filters.district) {
				items.push({
					id: "district",
					label: `District: ${filters.district}`,
					onRemove: () => onFilterChange({ district: "", page: 1 }),
				});
			}

			if (filters.minPrice || filters.maxPrice) {
				items.push({
					id: "price",
					label: `${Number(filters.minPrice || 0).toLocaleString()} – ${Number(
						filters.maxPrice || DEFAULT_PRICE_MAX,
					).toLocaleString()} RWF`,
					onRemove: () =>
						onFilterChange({ minPrice: "", maxPrice: "", page: 1 }),
				});
			}

			if (filters.onlyInStock) {
				items.push({
					id: "stock",
					label: "In Stock",
					onRemove: () => onFilterChange({ onlyInStock: false, page: 1 }),
				});
			}

			return items;
		}, [filters, categories, onFilterChange]);

		return <ActiveFilterBadges items={badgeItems} />;
	},
);
ActiveFilters.displayName = "ActiveFilters";
