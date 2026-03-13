import { Skeleton } from "@/components/ui/skeleton";
import {
	Building2,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { cn } from "@/lib/utils";
import {
	useGetServicesQuery,
} from "@/services/api/services";
import type { MarketplaceItem } from "@/types";
import { ServiceCard } from "./catalog/service-card";

interface ServiceListingViewProps {
	viewMode: "grid" | "list";
	isAuthenticated: boolean;
	wishlistIds: Set<string>;
	onToggleWishlist: (e: any, item: MarketplaceItem) => void;
	onSupplierClick: (e: any, companyId: string) => void;
	onClick: (item: MarketplaceItem) => void;
}

const PAGE_SIZE = 12;

export const ServiceListingView: React.FC<ServiceListingViewProps> = ({
	viewMode,
	isAuthenticated,
	wishlistIds,
	onToggleWishlist,
	onSupplierClick,
	onClick,
}) => {
	const { filters, patchFilters, resetFilters } = useMarketplaceFilters();

	const sharedParams = useMemo(() => ({
		page: filters.page,
		limit: PAGE_SIZE,
		query: (filters.searchQuery || "").trim() || undefined,
		categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
		district: (filters.district || "").trim() || undefined,
		minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
		maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
		companyType:
			filters.companyType === "all" ? undefined : filters.companyType,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder as "ASC" | "DESC" | undefined,
	}), [filters]);

	const { data: servicesData, isFetching } = useGetServicesQuery(sharedParams);

	const services = useMemo(
		() => (servicesData?.data || []).map(s => ({ ...s, itemType: "SERVICE" as const })),
		[servicesData],
	);
	const meta = servicesData?.meta;

	if (isFetching && services.length === 0) {
		return (
			<div
				className={cn(
					"grid grid-cols-2 gap-4 md:gap-6",
					viewMode === "grid"
						? "lg:grid-cols-2 xl:grid-cols-3"
						: "grid-cols-1",
				)}
			>
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton
						key={`skeleton-${i}`}
						className="h-80 border border-border/10 rounded-none"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-10">
			{services.length === 0 ? (
				<div className="py-20 flex justify-center w-full">
					<Empty className="max-w-md w-full">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Building2 className="w-4 h-4 text-primary" />
							</EmptyMedia>
							<EmptyTitle className="text-xl font-display font-black uppercase">
								No Services Found
							</EmptyTitle>
							<EmptyDescription className="uppercase tracking-widest text-[10px]">
								We couldn't find any professional services matching your current
								filters.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								onClick={resetFilters}
								className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
							>
								Clear All Filters
							</Button>
						</EmptyContent>
					</Empty>
				</div>
			) : (
				<div
					className={cn(
						"grid gap-4 md:gap-6",
						viewMode === "grid"
							? "grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
							: "grid-cols-1",
					)}
				>
					{services.map((item) => (
						<ServiceCard
							key={item.id}
							service={item}
							viewMode={viewMode}
							isInWishlist={isAuthenticated && wishlistIds.has(item.id)}
							onToggleWishlist={(e: any) => onToggleWishlist(e, item)}
							onSupplierClick={(e: any) => onSupplierClick(e, item.company.id)}
							onClick={() => onClick(item)}
						/>
					))}
				</div>
			)}

			{meta && meta.totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 pt-8 border-t border-border/20">
					<Button
						variant="outline"
						size="sm"
						className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
						disabled={filters.page <= 1}
						onClick={() => patchFilters({ page: filters.page - 1 })}
					>
						<ChevronLeft className="w-3.5 h-3.5 mr-1" />
						Prev
					</Button>
					<span className="flex items-center px-4 text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground/30">
						{meta.page} / {meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-9 sm:h-10 px-4 sm:px-6 border-border/40"
						disabled={filters.page >= meta.totalPages}
						onClick={() => patchFilters({ page: filters.page + 1 })}
					>
						Next
						<ChevronRight className="w-3.5 h-3.5 ml-1" />
					</Button>
				</div>
			)}
		</div>
	);
};
