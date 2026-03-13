import { RiAuctionLine, RiTimeLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { ResourceCard } from "@/shared/components/catalog/resource-card";
import { formatCurrency } from "@/shared/utils/format";
import type { Auction } from "@/types";

interface AuctionCardProps {
	auction: Auction;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
	const navigate = useNavigate();
	const isEndingSoon =
		new Date(auction.endDate).getTime() - Date.now() < 86400000; // < 24h

	const badges = (
		<Badge className="rounded-none bg-background/90 text-foreground text-[10px] font-black uppercase tracking-widest backdrop-blur-sm border-none shadow-xl">
			{auction.status}
		</Badge>
	);

	const topRight = isEndingSoon && (
		<Badge
			variant="destructive"
			className="rounded-none gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest animate-pulse border-none shadow-xl"
		>
			<RiTimeLine className="h-3 w-3" />
			Ending Soon
		</Badge>
	);

	const footer = (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
					Seller
				</span>
				<span className="text-[10px] font-bold text-foreground line-clamp-1">
					{auction.company?.name || "Verified Seller"}
				</span>
			</div>
			<div className="flex h-10 w-full items-center justify-center gap-2 rounded-none bg-foreground text-background transition-transform hover:scale-[1.02] active:scale-100 group-hover:bg-primary transition-colors">
				<RiAuctionLine className="h-4 w-4" />
				<span className="text-[10px] font-black uppercase tracking-widest">
					Place Bid
				</span>
			</div>
		</div>
	);

	return (
		<ResourceCard
			id={auction.id}
			name={auction.title}
			image={auction.images?.[0]}
			categoryName="Live Auction"
			onClick={() => navigate({ to: `/auctions/${auction.id}` })}
			badges={badges}
			topRight={topRight}
			footer={footer}
		>
			<div className="flex flex-col gap-3">
				<p className="line-clamp-2 text-xs text-muted-foreground/80 font-medium h-8 text-left">
					{auction.description || "No description provided."}
				</p>

				<div className="flex items-center justify-between border-t border-border/10 pt-3">
					<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
						Starting Bid
					</span>
					<span className="font-mono text-sm font-bold text-primary">
						{formatCurrency(auction.startingPrice, "RWF")}
					</span>
				</div>
			</div>
		</ResourceCard>
	);
};
