import { SlidersHorizontal } from "lucide-react";
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
			<div className="space-y-12">
				<div
					className={cn(
						"grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6",
						showFilters
							? "xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6"
							: "xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8",
					)}
				>
					{Array.from({ length: 12 }).map((_, i) => (
						<div
							key={`serv-skeleton-${i}`}
							className="h-72 bg-muted/5 animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className="py-20 flex justify-center">
				<Empty className="max-w-md">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SlidersHorizontal className="w-4 h-4 text-primary" />
						</EmptyMedia>
						<EmptyTitle className="text-xl font-display font-black uppercase">
							No Services Found
						</EmptyTitle>
						<EmptyDescription className="uppercase tracking-widest text-[10px]">
							We couldn't find any services matching your current filters. Try
							adjusting your search.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							onClick={resetFilters}
							className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
						>
							Reset Filters
						</Button>
					</EmptyContent>
				</Empty>
			</div>
		);
	}

	return (
		<div className="space-y-12 w-full">
			<div
				className={cn(
					viewMode === "grid"
						? cn(
								"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
								showFilters
									? "xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6"
									: "xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8",
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
				<div className="flex justify-center items-center gap-2 sm:gap-4 pt-6 md:pt-10 border-t border-border/20">
					<Button
						variant="outline"
						size="sm"
						disabled={filters.page <= 1}
						onClick={() => patchFilters({ page: filters.page - 1 })}
						className="rounded-none h-9 sm:h-10 px-4 sm:px-6 uppercase text-[8px] sm:text-[9px] font-bold tracking-widest"
					>
						Prev
					</Button>
					<span className="flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-2">
						{meta.page} / {meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={filters.page >= meta.totalPages}
						onClick={() => patchFilters({ page: filters.page + 1 })}
						className="rounded-none h-9 sm:h-10 px-4 sm:px-6 uppercase text-[8px] sm:text-[9px] font-bold tracking-widest"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};
