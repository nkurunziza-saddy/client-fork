import { RiAuctionLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useGetAuctionsQuery } from "@/services/api/auctions";
import { AuctionCard } from "./auction-card";

export const AuctionsGrid: React.FC = () => {
	const { data: auctionsResult, isLoading } = useGetAuctionsQuery({
		limit: 50,
		status: "APPROVED",
	});
	const auctions = auctionsResult?.data || [];

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] w-full items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
						Loading Auctions...
					</p>
				</div>
			</div>
		);
	}

	if (auctions.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center rounded-none border border-dashed border-border/40 bg-muted/10 p-12 text-center">
				<div className="mb-4 rounded-none bg-background p-4 shadow-sm border border-border/20">
					<RiAuctionLine className="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 className="mb-2 font-display text-lg font-black uppercase tracking-wide">
					No active auctions
				</h3>
				<p className="mb-6 max-w-sm text-sm text-muted-foreground text-center">
					There are currently no active auctions happening. Check back later as
					our suppliers upload new properties and items!
				</p>
				<Button
					variant="outline"
					className="h-11 rounded-none border-border/40 px-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
					onClick={() => window.location.reload()}
				>
					Refresh Page
				</Button>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{auctions.map((auction) => (
				<AuctionCard key={auction.id} auction={auction} />
			))}
		</div>
	);
};
