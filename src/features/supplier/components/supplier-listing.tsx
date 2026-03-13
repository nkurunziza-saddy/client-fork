import {
	Building2,
	SlidersHorizontal,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useSupplierFilters } from "@/hooks/use-supplier-filters";
import { cn } from "@/lib/utils";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetCompanyCategoriesQuery } from "@/services/api/company-categories";
import type { Company } from "@/types";
import { MarketplaceToolbar } from "@/features/marketplace/components/marketplace-toolbar";
import { SupplierCard } from "./listing/supplier-card";
import { SupplierFilterPanel } from "./listing/supplier-filter-panel";
import { Skeleton } from "@/components/ui/skeleton";

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

	const { filters, handleFiltersChange, handleClearFilters } =
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

	const hasActiveFilters =
		filters.district ||
		filters.type !== "all" ||
		Number(filters.minRating) > 0 ||
		filters.categoryId !== "all" ||
		filters.verified;

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-background border-b border-border sticky top-[56px] z-30 py-3 md:py-5">
				<div className="max-w-[1800px] mx-auto px-2 md:px-6">
					<div className="flex flex-row items-center justify-between gap-4">
						<div className="space-y-0.5">
							<h1 className="text-xl md:text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none">
								Supplier Directory
							</h1>
							<div className="hidden xs:flex items-center gap-2">
								<div className="h-px w-6 bg-primary" />
								<p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
									Verified Providers
								</p>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div className="max-w-[1800px] mx-auto px-1 md:px-6 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row gap-8 items-start">
					{/* Desktop Sidebar */}
					{showFilters && (
						<aside className="hidden lg:block w-64 shrink-0 sticky top-24">
							<div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50 pr-4">
								<h2 className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
									<SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
									Filters
								</h2>
								{hasActiveFilters ? (
									<Button
										variant="ghost"
										size="sm"
										className="h-5 px-0 text-[8px] uppercase font-black tracking-widest text-muted-foreground/60 hover:text-destructive hover:bg-transparent"
										onClick={handleClearFilters}
									>
										Reset
									</Button>
								) : null}
							</div>
							<div className="pr-4">
								<SupplierFilterPanel
									filters={filters}
									categories={categories}
									onFilterChange={handleFiltersChange}
								/>
							</div>
						</aside>
					)}

					{/* Main Content */}
					<div className="flex-1 min-w-0">
						{/* Toolbar */}
						<div className="flex flex-col gap-4 mb-8">
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
								filterButton={
									<Drawer
										open={isMobileFiltersOpen}
										onOpenChange={setIsMobileFiltersOpen}
									>
										<DrawerTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="lg:hidden rounded-none border-border/40 h-10 font-black uppercase text-[10px] tracking-widest px-4 gap-2"
											>
												<SlidersHorizontal className="w-3.5 h-3.5" />
												Filters
												{hasActiveFilters && (
													<span className="w-1.5 h-1.5 rounded-full bg-primary" />
												)}
											</Button>
										</DrawerTrigger>
										<DrawerContent className="bg-background flex flex-col">
											<DrawerHeader className="p-6 border-b border-border/40 shrink-0 text-left">
												<DrawerTitle className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
													<SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
													Supplier Filters
												</DrawerTitle>
											</DrawerHeader>
											<div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
												<SupplierFilterPanel
													filters={filters}
													categories={categories}
													onFilterChange={handleFiltersChange}
												/>
											</div>
											{hasActiveFilters && (
												<div className="p-6 border-t border-border/40 shrink-0 bg-muted/5">
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-center h-10 text-[9px] uppercase font-black tracking-[0.2em] border border-destructive/20 text-destructive hover:bg-destructive/5"
														onClick={() => {
															handleClearFilters();
															setIsMobileFiltersOpen(false);
														}}
													>
														Reset All Filters
													</Button>
												</div>
											)}
										</DrawerContent>
									</Drawer>
								}
							/>

							<div className="flex flex-wrap items-center justify-between gap-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
								<span>
									Showing {companies.length} of {meta?.total ?? companies.length}{" "}
									suppliers
								</span>
								<span className="hidden sm:inline">
									Page {meta?.page ?? filters.page} /{" "}
									{meta?.totalPages ?? 1}
								</span>
							</div>

							{/* Active Filters Badges */}
							{hasActiveFilters && (
								<div className="flex flex-wrap gap-2 items-center mt-2">
									{filters.categoryId !== "all" && (
										<Badge
											variant="secondary"
											className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
										>
											{categories.find((c) => c.id === filters.categoryId)
												?.name || "Category"}
											<X
												className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors"
												onClick={() =>
													handleFiltersChange({ categoryId: "all" })
												}
											/>
										</Badge>
									)}
									{filters.type !== "all" && (
										<Badge
											variant="secondary"
											className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
										>
											{COMPANY_TYPES.find((t) => t.value === filters.type)
												?.label || filters.type}
											<X
												className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors"
												onClick={() => handleFiltersChange({ type: "all" })}
											/>
										</Badge>
									)}
									{filters.district && (
										<Badge
											variant="secondary"
											className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
										>
											{filters.district}
											<X
												className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors"
												onClick={() => handleFiltersChange({ district: "" })}
											/>
										</Badge>
									)}
									{Number(filters.minRating) > 0 && (
										<Badge
											variant="secondary"
											className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
										>
											{filters.minRating}+ Stars
											<X
												className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors"
												onClick={() => handleFiltersChange({ minRating: "0" })}
											/>
										</Badge>
									)}
									{filters.verified && (
										<Badge
											variant="secondary"
											className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
										>
											Verified
											<X
												className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors"
												onClick={() => handleFiltersChange({ verified: false })}
											/>
										</Badge>
									)}
								</div>
							)}
						</div>

						{isLoading ? (
							<div
								className={cn(
									"grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6",
									showFilters
										? ""
										: "md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
								)}
							>
								{Array.from({ length: 12 }).map((_, i) => (
									<Skeleton
										key={`supplier-skeleton-${i}`}
										className="h-72 rounded-none border border-border/10"
									/>
								))}
							</div>
						) : (
							<>
								{companies.length === 0 ? (
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
												? cn(
														"grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-6",
														showFilters
															? "grid-cols-2"
															: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
													)
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
								)}

								{meta && meta.totalPages > 1 && (
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
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SupplierListing;
