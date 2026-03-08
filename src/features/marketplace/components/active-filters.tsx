import { X } from "lucide-react";
import type React from "react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
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
		const active =
			filters.categoryId !== "all" ||
			filters.type !== "all" ||
			filters.companyType !== "all" ||
			filters.district ||
			filters.minPrice ||
			filters.maxPrice ||
			filters.onlyInStock;

		if (!active) return null;

		return (
			<div className="flex flex-wrap gap-2 items-center mt-2">
				{filters.categoryId !== "all" && (
					<FilterBadge
						label={
							categories.find((c) => c.id === filters.categoryId)?.name ??
							"Category"
						}
						onRemove={() => onFilterChange({ categoryId: "all", page: 1 })}
					/>
				)}
				{filters.companyType !== "all" && (
					<FilterBadge
						label={
							COMPANY_TYPES.find((t) => t.value === filters.companyType)
								?.label ?? filters.companyType
						}
						onRemove={() => onFilterChange({ companyType: "all", page: 1 })}
					/>
				)}
				{filters.type !== "all" && (
					<FilterBadge
						label={filters.type === "PRODUCT" ? "Products" : "Services"}
						onRemove={() => onFilterChange({ type: "all", page: 1 })}
					/>
				)}
				{filters.district && (
					<FilterBadge
						label={`District: ${filters.district}`}
						onRemove={() => onFilterChange({ district: "", page: 1 })}
					/>
				)}
				{(filters.minPrice || filters.maxPrice) && (
					<FilterBadge
						label={`${Number(filters.minPrice || 0).toLocaleString()} – ${Number(
							filters.maxPrice || DEFAULT_PRICE_MAX,
						).toLocaleString()} RWF`}
						onRemove={() =>
							onFilterChange({ minPrice: "", maxPrice: "", page: 1 })
						}
					/>
				)}
				{filters.onlyInStock && (
					<FilterBadge
						label="In Stock"
						onRemove={() => onFilterChange({ onlyInStock: false, page: 1 })}
					/>
				)}
			</div>
		);
	},
);
ActiveFilters.displayName = "ActiveFilters";

const FilterBadge: React.FC<{ label: string; onRemove: () => void }> = ({
	label,
	onRemove,
}) => (
	<Badge
		variant="secondary"
		className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
	>
		{label}
		<button
			type="button"
			onClick={onRemove}
			aria-label={`Remove ${label} filter`}
		>
			<X className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors" />
		</button>
	</Badge>
);
