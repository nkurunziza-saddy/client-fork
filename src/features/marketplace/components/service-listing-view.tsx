import { SlidersHorizontal } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { cn } from "@/lib/utils";
import {
	selectServicesData,
	selectServicesMeta,
	useGetServicesQuery,
} from "@/services/api/services";
import { ServiceCard } from "./catalog/service-card";

const PAGE_SIZE = 30;

interface ServiceViewGridProps {
	viewMode: "grid" | "list";
	showFilters: boolean;
	isAuthenticated: boolean;
	wishlistIds: Set<string>;
	onToggleWishlist: (e: React.MouseEvent, item: any) => void;
	onSupplierClick: (e: React.MouseEvent, companyId: string) => void;
	onClick: (item: any) => void;
}

export const ServiceListingView: React.FC<ServiceViewGridProps> = ({
	viewMode,
	showFilters,
	isAuthenticated,
	wishlistIds,
	onToggleWishlist,
	onSupplierClick,
	onClick,
}) => {
	const { filters, patchFilters, resetFilters } = useMarketplaceFilters();

	const { data: servicesData, isFetching } = useGetServicesQuery({
		page: filters.page,
		limit: PAGE_SIZE,
		query: filters.searchQuery.trim() || undefined,
		categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
		district: filters.district.trim() || undefined,
		minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
		maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
		companyType:
			filters.companyType === "all" ? undefined : filters.companyType,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
	});

	const services = useMemo(
		() => selectServicesData(servicesData),
		[servicesData],
	);
	const meta = useMemo(() => selectServicesMeta(servicesData), [servicesData]);

	if (isFetching && services.length === 0) {
		return (
			<div
				className={cn(
					"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					showFilters ? "xl:grid-cols-4" : "xl:grid-cols-5 2xl:grid-cols-6",
				)}
			>
				{Array.from({ length: 9 }).map((_, i) => (
					<div
						key={`serv-skeleton-${i}`}
						className="h-72 bg-muted/5 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-32 text-center bg-muted/5">
				<SlidersHorizontal className="w-12 h-12 text-primary/20 mb-6" />
				<h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
					No Services Found
				</h3>
				<p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">
					Try adjusting your filters
				</p>
				<Button onClick={resetFilters} className="rounded-none">
					Reset Filters
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-12">
			<div
				className={cn(
					viewMode === "grid"
						? cn(
								"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
								showFilters
									? "xl:grid-cols-4"
									: "xl:grid-cols-5 2xl:grid-cols-6",
							)
						: "flex flex-col gap-6",
					isFetching && "opacity-60",
				)}
			>
				{services.map((service) => (
					<ServiceCard
						key={service.id}
						service={service as any}
						viewMode={viewMode}
						isInWishlist={isAuthenticated && wishlistIds.has(service.id)}
						onToggleWishlist={(e) =>
							onToggleWishlist(e, { ...service, itemType: "SERVICE" })
						}
						onSupplierClick={(e) => onSupplierClick(e, service.company?.id)}
						onClick={() => onClick({ ...service, itemType: "SERVICE" })}
					/>
				))}
			</div>

			{meta && meta.totalPages > 1 && (
				<div className="flex justify-center gap-4 pt-10 border-t border-border/20">
					<Button
						variant="outline"
						disabled={filters.page <= 1}
						onClick={() => patchFilters({ page: filters.page - 1 })}
						className="rounded-none h-10 px-6 uppercase text-[9px] font-bold tracking-widest"
					>
						Previous
					</Button>
					<span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
						Page {meta.page} of {meta.totalPages}
					</span>
					<Button
						variant="outline"
						disabled={filters.page >= meta.totalPages}
						onClick={() => patchFilters({ page: filters.page + 1 })}
						className="rounded-none h-10 px-6 uppercase text-[9px] font-bold tracking-widest"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};
