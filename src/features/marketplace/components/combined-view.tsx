import { Package } from "lucide-react";
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
	selectProductsData,
	useGetProductsQuery,
} from "@/services/api/products";
import {
	selectServicesData,
	useGetServicesQuery,
} from "@/services/api/services";
import type { MarketplaceItem } from "@/types";
import { ProductCard } from "./catalog/product-card";
import { ServiceCard } from "./catalog/service-card";

const PAGE_SIZE = 30;

interface CombinedViewProps {
	viewMode: "grid" | "list";
	showFilters: boolean;
	isAuthenticated: boolean;
	wishlistIds: Set<string>;
	onToggleWishlist: (e: React.MouseEvent, item: any) => void;
	onSupplierClick: (e: React.MouseEvent, companyId: string) => void;
	onProductClick: (item: any) => void;
}

export const CombinedView: React.FC<CombinedViewProps> = ({
	viewMode,
	showFilters,
	isAuthenticated,
	wishlistIds,
	onToggleWishlist,
	onSupplierClick,
	onProductClick,
}) => {
	const { filters, patchFilters, resetFilters } = useMarketplaceFilters();

	const sharedParams = {
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
	};

	const { data: productsData, isFetching: productsFetching } =
		useGetProductsQuery({
			...sharedParams,
			inStock: filters.onlyInStock ? true : undefined,
		});

	const { data: servicesData, isFetching: servicesFetching } =
		useGetServicesQuery(sharedParams);

	const isFetching = productsFetching || servicesFetching;

	const items = useMemo<MarketplaceItem[]>(() => {
		const products = (selectProductsData(productsData) || []).map(
			(p): MarketplaceItem => ({ ...p, itemType: "PRODUCT" }),
		);
		const services = (selectServicesData(servicesData) || []).map(
			(s): MarketplaceItem => ({ ...s, itemType: "SERVICE" }),
		);
		return [...products, ...services];
	}, [productsData, servicesData]);

	const totalPages = useMemo(() => {
		const pMeta = productsData?.meta?.totalPages ?? 1;
		const sMeta = servicesData?.meta?.totalPages ?? 1;
		return Math.max(pMeta, sMeta);
	}, [productsData?.meta, servicesData?.meta]);

	if (isFetching && items.length === 0) {
		return (
			<div className="space-y-12">
				<div
					className={cn(
						"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
						showFilters
							? "xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6"
							: "xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8",
					)}
				>
					{Array.from({ length: 12 }).map((_, i) => (
						<div
							key={`comb-skeleton-${i}`}
							className="h-72 bg-muted/5 animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="py-20 flex justify-center">
				<Empty className="max-w-md">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Package className="w-4 h-4 text-primary" />
						</EmptyMedia>
						<EmptyTitle className="text-xl font-display font-black uppercase">
							No Results Found
						</EmptyTitle>
						<EmptyDescription className="uppercase tracking-widest text-[10px]">
							We couldn't find any items matching your current filters. Try
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
				{items.map((item) => {
					const isService = item.itemType === "SERVICE";
					const uniqueKey = `${item.id}-${item.itemType}`;
					const commonProps = {
						viewMode,
						isInWishlist: isAuthenticated && wishlistIds.has(item.id),
						onToggleWishlist: (e: React.MouseEvent) =>
							onToggleWishlist(e, item),
						onSupplierClick: (e: React.MouseEvent) =>
							onSupplierClick(e, item.company?.id),
						onClick: () => onProductClick(item),
					};

					return isService ? (
						<ServiceCard
							key={uniqueKey}
							{...commonProps}
							service={item as any}
						/>
					) : (
						<ProductCard
							key={uniqueKey}
							{...commonProps}
							product={item as any}
						/>
					);
				})}
			</div>

			{totalPages > 1 && (
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
						Page {filters.page} of {totalPages}
					</span>
					<Button
						variant="outline"
						disabled={filters.page >= totalPages}
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
