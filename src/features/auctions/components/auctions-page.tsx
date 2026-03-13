import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuctionsFilters } from "@/hooks/use-auctions-filters";
import {
	ActiveFilterBadges,
	type FilterBadgeItem,
} from "@/shared/components/active-filter-badges";
import { MarketplaceLayout } from "@/shared/components/layouts/marketplace-layout";
import { AuctionsGrid } from "./auctions-grid";

interface SortSelectProps {
	className?: string;
	sortValue: string;
	onSortChange: (val: string | null) => void;
	options: { label: string; value: string }[];
}

const SortSelect = ({
	className,
	sortValue,
	onSortChange,
	options,
}: SortSelectProps) => (
	<Select value={sortValue} onValueChange={onSortChange}>
		<SelectTrigger className={className}>
			<SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground mr-1" />
			<SelectValue placeholder="Sort by" />
		</SelectTrigger>
		<SelectContent className="rounded-none border-border/40 shadow-xl">
			{options.map((opt) => (
				<SelectItem key={opt.value} value={opt.value} className="text-xs">
					{opt.label}
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);

export function AuctionsPage() {
	const { searchInput, setSearchInput, filters, patchFilters, isPending } =
		useAuctionsFilters();
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const sortValue = `${filters.sortBy}-${filters.sortOrder}`;
	const handleSortChange = (val: string | null) => {
		const [sortBy, sortOrder] = (val || "-").split("-");
		patchFilters({ sortBy, sortOrder });
	};

	const sortOptions = [
		{ label: "Newest First", value: "createdAt-DESC" },
		{ label: "Oldest First", value: "createdAt-ASC" },
		{ label: "Price: Low to High", value: "startingPrice-ASC" },
		{ label: "Price: High to Low", value: "startingPrice-DESC" },
	];

	const badgeItems = useMemo<FilterBadgeItem[]>(() => {
		const items: FilterBadgeItem[] = [];

		if (filters.q) {
			items.push({
				id: "search",
				label: `Search: ${filters.q}`,
				onRemove: () => patchFilters({ q: "" }),
			});
		}

		if (filters.minPrice || filters.maxPrice) {
			items.push({
				id: "price",
				label: `Price: ${filters.minPrice || 0} - ${filters.maxPrice || "Max"}`,
				onRemove: () =>
					patchFilters({ minPrice: undefined, maxPrice: undefined }),
			});
		}

		return items;
	}, [filters, patchFilters]);

	const toolbar = (
		<div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
			<div className="relative flex-1 group hidden md:block max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
				<Input
					placeholder="SEARCH AUCTIONS..."
					className="pl-10 bg-muted/20 border-border/40 rounded-none focus:bg-background focus:ring-0 focus:border-primary/60 h-10 w-full font-display font-medium text-xs transition-all"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
			</div>

			<div className="hidden md:flex items-center bg-muted/20 border border-border/10 p-0.5 rounded-none h-10">
				<SortSelect
					className="h-full rounded-none border-0 bg-transparent ring-0 focus:ring-0 gap-2 px-3 text-xs font-medium w-[140px]"
					sortValue={sortValue}
					onSortChange={handleSortChange}
					options={sortOptions}
				/>
			</div>
		</div>
	);

	const mobileFilters = (
		<div className="space-y-4">
			<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
				Sort By
			</p>
			<SortSelect
				className="h-11 rounded-none border-border/40 text-[10px] uppercase font-bold"
				sortValue={sortValue}
				onSortChange={handleSortChange}
				options={sortOptions}
			/>
		</div>
	);

	return (
		<MarketplaceLayout
			title="Auctions"
			subtitle="Live Bidding Events"
			showFilters={false}
			hasActiveFilters={badgeItems.length > 0}
			onToggleFilters={() => {}}
			onResetFilters={() =>
				patchFilters({
					q: "",
					minPrice: undefined,
					maxPrice: undefined,
					sortBy: "createdAt",
					sortOrder: "DESC",
				})
			}
			isMobileFiltersOpen={isMobileFiltersOpen}
			setIsMobileFiltersOpen={setIsMobileFiltersOpen}
			isPending={isPending}
			activeFilters={<ActiveFilterBadges items={badgeItems} />}
			toolbar={toolbar}
			mobileFilters={mobileFilters}
			content={
				<div className="space-y-6">
					<div className="md:hidden relative group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
						<Input
							placeholder="SEARCH AUCTIONS..."
							className="pl-10 bg-muted/10 border-border/40 rounded-none focus:bg-background focus:ring-0 focus:border-primary/60 h-11 w-full font-display font-medium text-xs transition-all"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<AuctionsGrid />
					</div>
				</div>
			}
		/>
	);
}
