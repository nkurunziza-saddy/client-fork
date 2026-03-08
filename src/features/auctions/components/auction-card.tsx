import { RiAuctionLine, RiTimeLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Auction } from "@/types";

interface AuctionCardProps {
	auction: Auction;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
	const fallbackImage = "/placeholder-auction.webp";
	const displayImage = auction.images?.[0] || fallbackImage;
	const isEndingSoon =
		new Date(auction.endDate).getTime() - Date.now() < 86400000; // < 24h

	return (
		<Card className="group flex h-full flex-col overflow-hidden rounded-none border border-border/40 bg-background/50 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
			<Link
				to={`/auctions/${auction.id}` as any}
				className="relative block aspect-[4/3] overflow-hidden bg-muted/20"
			>
				<img
					src={displayImage}
					alt={auction.title}
					className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
				/>

				<div className="absolute top-3 left-3 flex flex-col gap-2">
					<Badge className="rounded-none bg-background/90 text-foreground text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
						{auction.status}
					</Badge>
				</div>

				{isEndingSoon && (
					<div className="absolute top-3 right-3">
						<Badge
							variant="destructive"
							className="rounded-none gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest animate-pulse"
						>
							<RiTimeLine className="h-3 w-3" />
							Ending Soon
						</Badge>
					</div>
				)}
			</Link>

			<CardContent className="flex flex-1 flex-col p-5">
				<div className="mb-4">
					<h3 className="font-display text-lg font-black uppercase tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
						{auction.title}
					</h3>
					<p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80 font-medium">
						{auction.description || "No description provided."}
					</p>
				</div>

				<div className="mt-auto flex flex-col gap-3 border-t border-border/20 pt-4">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
							Starting Bid
						</span>
						<span className="font-mono text-sm font-bold text-primary">
							{auction.startingPrice.toLocaleString()} RWF
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
							Seller
						</span>
						<span className="text-[10px] font-bold text-foreground line-clamp-1">
							{auction.company?.name || "Verified Seller"}
						</span>
					</div>
				</div>
			</CardContent>

			{/* Action Area */}
			<div className="border-t border-border/20 bg-muted/5 p-3">
				<Link to={`/auctions/${auction.id}` as any}>
					<div className="flex h-10 w-full items-center justify-center gap-2 rounded-none bg-foreground text-background transition-transform hover:scale-[1.02] active:scale-100">
						<RiAuctionLine className="h-4 w-4" />
						<span className="text-[10px] font-black uppercase tracking-widest">
							Place Bid
						</span>
					</div>
				</Link>
			</div>
		</Card>
	);
};
