import {
	Building2,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useSupplierFilters } from "@/hooks/use-supplier-filters";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetCompanyCategoriesQuery } from "@/services/api/company-categories";
import type { Company } from "@/types";
import { MarketplaceToolbar } from "@/features/marketplace/components/marketplace-toolbar";
import { SupplierCard } from "./listing/supplier-card";
import { SupplierFilterPanel } from "./listing/supplier-filter-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceLayout } from "@/shared/components/layouts/marketplace-layout";
import { ActiveFilterBadges, type FilterBadgeItem } from "@/shared/components/active-filter-badges";

interface SupplierListingProps {
	onSupplierClick?: (supplierId: string) => void;
}

const PAGE_SIZE = 12;

const COMPANY_TYPES = [
	{ value: "SUPPLIER_DEALER", label: "Dealer" },
	{ value: "SUPPLIER_RETAILER", label: "Retailer" },
	{ value: "SUPPLIER_WHOLESALER", label: "Wholesaler/Importer" },
	{ value: "MANUFACTURER_RWANDA", label: "Factory (Rwanda)" },
	{ value: "MANUFACTURER_EAC", label: "Factory (EAC)" },
	{ value: "SERVICE_PROVIDER", label: "Service Provider" },
];

const SupplierListing: React.FC<SupplierListingProps> = ({
	onSupplierClick,
}) => {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(true);
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const { filters, handleFiltersChange, handleClearFilters, isPending } =
		useSupplierFilters();

	const { data: listData, isLoading } = useGetCompaniesQuery({
		page: filters.page,
		limit: PAGE_SIZE,
		query: filters.searchQuery || undefined,
		categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
		district: filters.district || undefined,
		type: filters.type === "all" ? undefined : filters.type,
		minRating:
			Number(filters.minRating) > 0 ? Number(filters.minRating) : undefined,
		isVerified: filters.verified ? true : undefined,
	});

	const { data: categoriesData } = useGetCompanyCategoriesQuery({ limit: 50 });

	const companies: Company[] = listData?.data || [];
	const meta = listData?.meta;
	const categories = categoriesData?.data ?? [];

	const badgeItems = useMemo<FilterBadgeItem[]>(() => {
		const items: FilterBadgeItem[] = [];

		if (filters.categoryId !== "all") {
			items.push({
				id: "category",
				label: categories.find((c) => c.id === filters.categoryId)?.name || "Category",
				onRemove: () => handleFiltersChange({ categoryId: "all" }),
			});
		}

		if (filters.type !== "all") {
			items.push({
				id: "type",
				label: COMPANY_TYPES.find((t) => t.value === filters.type)?.label || filters.type,
				onRemove: () => handleFiltersChange({ type: "all" }),
			});
		}

		if (filters.district) {
			items.push({
				id: "district",
				label: filters.district,
				onRemove: () => handleFiltersChange({ district: "" }),
			});
		}

		if (Number(filters.minRating) > 0) {
			items.push({
				id: "rating",
				label: `${filters.minRating}+ Stars`,
				onRemove: () => handleFiltersChange({ minRating: "0" }),
			});
		}

		if (filters.verified) {
			items.push({
				id: "verified",
				label: "Verified",
				onRemove: () => handleFiltersChange({ verified: false }),
			});
		}

		return items;
	}, [filters, categories, handleFiltersChange]);

	return (
		<MarketplaceLayout
			title="Supplier Directory"
			subtitle="Verified Providers"
			showFilters={showFilters}
			hasActiveFilters={badgeItems.length > 0}
			onToggleFilters={() => setShowFilters(!showFilters)}
			onResetFilters={handleClearFilters}
			isMobileFiltersOpen={isMobileFiltersOpen}
			setIsMobileFiltersOpen={setIsMobileFiltersOpen}
			isPending={isPending}
			activeFilters={<ActiveFilterBadges items={badgeItems} />}
			sidebar={
				<SupplierFilterPanel
					filters={filters}
					categories={categories}
					onFilterChange={handleFiltersChange}
				/>
			}
			toolbar={
				<MarketplaceToolbar
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					searchQuery={filters.searchQuery}
					onSearchChange={(val) =>
						handleFiltersChange({ searchQuery: val })
					}
					searchPlaceholder="SEARCH SUPPLIERS..."
					onToggleFilters={() => setShowFilters(!showFilters)}
					showFilters={showFilters}
					hideFilterButton // Handled by MarketplaceLayout
				/>
			}
			content={
				isLoading ? (
					<div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6">
						{Array.from({ length: 12 }).map((_, i) => (
							<Skeleton
								key={`supplier-skeleton-${i}`}
								className="h-72 rounded-none border border-border/10"
							/>
						))}
					</div>
				) : companies.length === 0 ? (
					<div className="py-20 flex justify-center w-full">
						<Empty className="max-w-md w-full">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Building2 className="w-4 h-4 text-primary" />
								</EmptyMedia>
								<EmptyTitle className="text-xl font-display font-black uppercase">
									No Suppliers Found
								</EmptyTitle>
								<EmptyDescription className="uppercase tracking-widest text-[10px]">
									We couldn't find any suppliers matching your current
									filters. Try adjusting your search.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									onClick={handleClearFilters}
									className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
								>
									Clear Filters
								</Button>
							</EmptyContent>
						</Empty>
					</div>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6"
								: "flex flex-col gap-4 sm:gap-6"
						}
					>
						{companies.map((company: Company) => (
							<SupplierCard
								key={company.id}
								company={company}
								onViewProfile={() => onSupplierClick?.(company.id)}
							/>
						))}
					</div>
				)
			}
			pagination={
				meta && meta.totalPages > 1 && (
					<div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 pt-8 border-t border-border/20">
						<Button
							variant="outline"
							size="sm"
							className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
							disabled={filters.page <= 1}
							onClick={() =>
								handleFiltersChange({ page: filters.page - 1 })
							}
						>
							Prev
						</Button>
						<span className="flex items-center px-2 text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground/30">
							{meta.page} / {meta.totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
							disabled={filters.page >= meta.totalPages}
							onClick={() =>
								handleFiltersChange({ page: filters.page + 1 })
							}
						>
							Next
						</Button>
					</div>
				)
			}
		/>
	);
};

export default SupplierListing;
