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
	selectProductsMeta,
	useGetProductsQuery,
} from "@/services/api/products";
import { ProductCard } from "./catalog/product-card";

const PAGE_SIZE = 30;

interface ProductViewProps {
	viewMode: "grid" | "list";
	showFilters: boolean;
	isAuthenticated: boolean;
	wishlistIds: Set<string>;
	onToggleWishlist: (e: React.MouseEvent, item: any) => void;
	onSupplierClick: (e: React.MouseEvent, companyId: string) => void;
	onProductClick: (item: any) => void;
}

export const ProductListingView: React.FC<ProductViewProps> = ({
	viewMode,
	showFilters,
	isAuthenticated,
	wishlistIds,
	onToggleWishlist,
	onSupplierClick,
	onProductClick,
}) => {
	const { filters, patchFilters, resetFilters } = useMarketplaceFilters();

	const { data: productsData, isFetching } = useGetProductsQuery({
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
		inStock: filters.onlyInStock ? true : undefined,
	});

	const products = useMemo(
		() => selectProductsData(productsData),
		[productsData],
	);
	const meta = useMemo(() => selectProductsMeta(productsData), [productsData]);

	if (isFetching && products.length === 0) {
		return (
			<div
				className={cn(
					"grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6",
					showFilters ? "xl:grid-cols-4" : "xl:grid-cols-5 2xl:grid-cols-6",
				)}
			>
				{Array.from({ length: 9 }).map((_, i) => (
					<div
						key={`prod-skeleton-${i}`}
						className="h-72 bg-muted/5 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="py-20 flex justify-center">
				<Empty className="max-w-md">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Package className="w-4 h-4 text-primary" />
						</EmptyMedia>
						<EmptyTitle className="text-xl font-display font-black uppercase">
							No Products Found
						</EmptyTitle>
						<EmptyDescription className="uppercase tracking-widest text-[10px]">
							We couldn't find any products matching your current filters. Try
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
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product as any}
						viewMode={viewMode}
						isInWishlist={isAuthenticated && wishlistIds.has(product.id)}
						onToggleWishlist={(e) =>
							onToggleWishlist(e, { ...product, itemType: "PRODUCT" })
						}
						onSupplierClick={(e) => onSupplierClick(e, product.company?.id)}
						onClick={() => onProductClick({ ...product, itemType: "PRODUCT" })}
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
