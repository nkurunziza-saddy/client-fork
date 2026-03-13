import { Skeleton } from "@/components/ui/skeleton";
import { RiAuctionLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useAuctionsFilters } from "@/hooks/use-auctions-filters";
import { useGetAuctionsQuery } from "@/services/api/auctions";
import { AuctionCard } from "./auction-card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const AuctionsGrid: React.FC = () => {
	const { filters, patchFilters } = useAuctionsFilters();

	const { data: auctionsResult, isLoading } = useGetAuctionsQuery({
		page: filters.page,
		limit: 12,
		status: "APPROVED",
		searchQuery: filters.q,
		minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
		maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder as any,
	});
	const auctions = auctionsResult?.data || [];

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-96 w-full rounded-none border border-border/10"
					/>
				))}
			</div>
		);
	}

	if (auctions.length === 0) {
		return (
			<Empty className="min-h-[400px] flex-col items-center justify-center rounded-none border border-dashed border-border/40 bg-muted/10 p-12 text-center">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<RiAuctionLine className="h-4 w-4 text-primary" />
					</EmptyMedia>
					<EmptyTitle className="text-xl font-display font-black uppercase">
						No active auctions
					</EmptyTitle>
					<EmptyDescription className="uppercase tracking-widest text-[10px]">
						There are currently no active auctions happening. Check back later as
						our suppliers upload new properties and items!
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						variant="outline"
						className="h-11 rounded-none border-border/40 px-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
						onClick={() => window.location.reload()}
					>
						Refresh Page
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{auctions.map((auction) => (
					<AuctionCard key={auction.id} auction={auction} />
				))}
			</div>

			{auctionsResult?.meta && auctionsResult.meta.totalPages > 1 && (
				<div className="flex justify-center gap-4 mt-16 pt-10 border-t border-border/20">
					<Button
						variant="outline"
						size="sm"
						className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-10 px-6 border-border/40"
						disabled={filters.page <= 1}
						onClick={() => patchFilters({ page: filters.page - 1 })}
					>
						Previous
					</Button>
					<span className="flex items-center px-6 text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground/30">
						Page {auctionsResult.meta.page} of {auctionsResult.meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="rounded-none font-display font-bold uppercase tracking-widest text-[8px] sm:text-[9px] h-10 px-6 border-border/40"
						disabled={filters.page >= auctionsResult.meta.totalPages}
						onClick={() => patchFilters({ page: filters.page + 1 })}
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
};
