import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { useGetCompanyCategoriesQuery } from "@/services/api/company-categories";
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { useGetServiceCategoriesQuery } from "@/services/api/service-categories";
import {
	useAddToWishlistMutation,
	useGetWishlistQuery,
	useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import { MarketplaceLayout } from "@/shared/components/layouts/marketplace-layout";
import type { RootState } from "@/store";
import type { CatalogFilters, MarketplaceItem } from "@/types";
import { ActiveFilters } from "./active-filters";
import { CombinedView } from "./combined-view";
import { FilterPanel } from "./filter-panel";
import { MarketplaceToolbar } from "./marketplace-toolbar";
import { ProductListingView } from "./product-listing-view";
import { ServiceListingView } from "./service-listing-view";

interface MarketplaceGridProps {
	onSupplierClick?: (supplierId: string) => void;
	onProductClick?: (item: MarketplaceItem) => void;
	forcedType?: "PRODUCT" | "SERVICE";
	from?: "/_main/products/" | "/_main/services/";
}

const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
	onSupplierClick,
	onProductClick,
	forcedType,
	from,
}) => {
	const {
		filters,
		patchFilters,
		resetFilters,
		searchInput,
		setSearchInput,
		priceRange,
		setPriceRange,
		commitPrice,
		hasActiveFilters,
		isPending,
	} = useMarketplaceFilters(from);

	const [showFilters, setShowFilters] = useState(true);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const { data: prodCat } = useGetProductCategoriesQuery(
		{ limit: 100 },
		{ skip: (forcedType || filters.type) === "SERVICE" },
	);
	const { data: servCat } = useGetServiceCategoriesQuery(
		{ limit: 100 },
		{ skip: (forcedType || filters.type) === "PRODUCT" },
	);
	const { data: compCat } = useGetCompanyCategoriesQuery({ limit: 100 });

	const categories = useMemo(() => {
		const p = prodCat?.data ?? [];
		const s = servCat?.data ?? [];
		const c = compCat?.data ?? [];

		const currentType = forcedType || filters.type;

		if (currentType === "PRODUCT") return p;
		if (currentType === "SERVICE") return s;

		return [...c, ...p, ...s].filter(
			(v, i, a) => a.findIndex((t) => t.id === v.id) === i,
		);
	}, [prodCat, servCat, compCat, filters.type, forcedType]);

	const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
	const { data: wishlistRaw = [] } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [addToWishlist] = useAddToWishlistMutation();
	const [removeFromWishlist] = useRemoveFromWishlistMutation();

	const wishlistIds = useMemo(
		() =>
			new Set(
				Array.isArray(wishlistRaw)
					? wishlistRaw.map((l: { id: string | number }) => String(l.id))
					: [],
			),
		[wishlistRaw],
	);

	const handleSupplierClick = useCallback(
		(e: React.MouseEvent, companyId: string) => {
			e.stopPropagation();
			onSupplierClick?.(companyId);
		},
		[onSupplierClick],
	);

	const handleToggleWishlist = useCallback(
		(e: React.MouseEvent, item: MarketplaceItem) => {
			e.stopPropagation();
			const type = item.itemType.toLowerCase() as "product" | "service";
			if (wishlistIds.has(item.id)) {
				removeFromWishlist({ id: item.id, type });
			} else {
				addToWishlist({ id: item.id, type });
			}
		},
		[wishlistIds, addToWishlist, removeFromWishlist],
	);

	const renderView = () => {
		const commonProps = {
			viewMode,
			isAuthenticated,
			wishlistIds,
			onToggleWishlist: handleToggleWishlist,
			onSupplierClick: handleSupplierClick,
		};

		const currentType = forcedType || filters.type;

		if (currentType === "PRODUCT") {
			return (
				<ProductListingView
					{...commonProps}
					onProductClick={(item) => onProductClick?.(item)}
				/>
			);
		}
		if (currentType === "SERVICE") {
			return (
				<ServiceListingView
					{...commonProps}
					onClick={(item) => onProductClick?.(item)}
				/>
			);
		}
		return (
			<CombinedView
				{...commonProps}
				onProductClick={(item) => onProductClick?.(item)}
			/>
		);
	};

	return (
		<MarketplaceLayout
			title="Marketplace"
			subtitle="Supplier Directory"
			showFilters={showFilters}
			hasActiveFilters={hasActiveFilters}
			onToggleFilters={() => setShowFilters(!showFilters)}
			onResetFilters={resetFilters}
			isMobileFiltersOpen={isMobileFiltersOpen}
			setIsMobileFiltersOpen={setIsMobileFiltersOpen}
			isPending={isPending}
			sidebar={
				<FilterPanel
					filters={filters as CatalogFilters}
					categories={categories}
					priceRange={priceRange}
					onPriceRangeChange={setPriceRange}
					onPriceCommit={commitPrice}
					onFilterChange={patchFilters}
				/>
			}
			toolbar={
				<MarketplaceToolbar
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					searchQuery={searchInput}
					onSearchChange={setSearchInput}
					searchPlaceholder="SEARCH CATALOG..."
					onToggleFilters={() => setShowFilters(!showFilters)}
					showFilters={showFilters}
					hideFilterButton // Handled by MarketplaceLayout
				/>
			}
			activeFilters={
				<ActiveFilters
					filters={filters as CatalogFilters}
					categories={categories}
					onFilterChange={patchFilters}
				/>
			}
			content={
				<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
					{renderView()}
				</div>
			}
		/>
	);
};

export default MarketplaceGrid;
