import {
	RiAuctionLine,
	RiCalendarEventLine,
	RiHistoryLine,
	RiMoneyDollarCircleLine,
	RiStore2Line,
} from "@remixicon/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useGetAuctionByIdQuery } from "@/services/api/auctions";
import { ContactActions } from "@/shared/components/contact-actions";
import { DetailsPageLayout } from "@/shared/components/layouts/details-page-layout";
import { DetailPageSkeleton } from "@/shared/components/skeletons";
import { formatDateTime } from "@/shared/utils/format";
import { PlaceBidModal } from "./place-bid-modal";

export function AuctionDetailsPage() {
	const navigate = useNavigate();
	const { auctionId } = useParams({ from: "/_main/auctions/$auctionId" });
	const { data: auction, isLoading } = useGetAuctionByIdQuery(auctionId);
	const [isBidModalOpen, setIsBidModalOpen] = useState(false);
	const [currentImageIdx, setCurrentImageIdx] = useState(0);

	if (isLoading) {
		return <DetailPageSkeleton />;
	}

	if (!auction) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center p-6">
				<Empty className="max-w-md w-full">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<RiAuctionLine className="w-4 h-4 text-primary" />
						</EmptyMedia>
						<EmptyTitle className="text-xl font-display font-black uppercase">
							Auction Not Found
						</EmptyTitle>
						<EmptyDescription className="uppercase tracking-widest text-[10px]">
							The auction you are looking for may have ended, been removed, or
							does not exist.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							onClick={() => navigate({ to: "/auctions" })}
							className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
						>
							Back to Auctions
						</Button>
					</EmptyContent>
				</Empty>
			</div>
		);
	}

	const statusLabel = auction.status || "Listed";

	return (
		<DetailsPageLayout
			title={auction.title}
			badgeText={statusLabel}
			onBack={() => navigate({ to: "/auctions" })}
			gallery={
				<div className="space-y-4">
					<div className="aspect-4/5 relative bg-muted/30 border border-border/40 flex items-center justify-center overflow-hidden w-full group">
						{auction.images && auction.images.length > 0 ? (
							<img
								src={auction.images[currentImageIdx] || auction.images[0]}
								alt={auction.title}
								className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
								onError={(e) => {
									e.currentTarget.src = "/image-fallback.svg";
								}}
							/>
						) : (
							<RiAuctionLine className="h-24 w-24 text-muted-foreground/20" />
						)}
					</div>

					{auction.images && auction.images.length > 1 && (
						<div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
							{auction.images.map((img: string, idx: number) => (
								<button
									key={idx}
									type="button"
									onClick={() => setCurrentImageIdx(idx)}
									className="aspect-square bg-muted border border-border/40 cursor-pointer overflow-hidden hover:border-primary/40 transition-colors p-0 focus:outline-none"
								>
									<img
										src={img}
										alt={`${auction.title} ${idx + 1}`}
										className={`size-full object-cover hover:opacity-80 transition-opacity ${currentImageIdx === idx ? "opacity-100 ring-2 ring-primary ring-inset" : "opacity-60"}`}
										onError={(e) => {
											e.currentTarget.src = "/image-fallback.svg";
										}}
									/>
								</button>
							))}
						</div>
					)}
				</div>
			}
			info={
				<div className="space-y-8">
					<div className="space-y-4 border-b border-border/40 pb-6 text-foreground">
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-xs text-muted-foreground font-mono">
								ID: {auction.id.slice(0, 8)}...
							</span>
							<div className="h-1 w-1 rounded-full bg-border/60" />
							<span className="text-xs text-muted-foreground font-mono">
								{auction.company?.district || "RW"}
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase tracking-tight leading-[1.1]">
							{auction.title}
						</h1>
					</div>

					<div className="bg-muted/10 p-6 border border-border/40 space-y-4">
						<div className="flex flex-col">
							<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
								Current / Starting Bid
							</span>
							<p className="text-3xl font-mono font-black text-primary">
								{auction.startingPrice.toLocaleString()} RWF
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
							<div className="flex flex-col gap-1">
								<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center">
									<RiCalendarEventLine className="w-3 h-3 mr-1" /> Starts
								</span>
								<span className="text-sm font-medium">
									{formatDateTime(auction.startDate)}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center">
									<RiCalendarEventLine className="w-3 h-3 mr-1 text-destructive/70" />{" "}
									Ends
								</span>
								<span className="text-sm font-medium">
									{formatDateTime(auction.endDate)}
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40 shadow-sm">
						<div className="bg-background p-4 flex flex-col gap-1">
							<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
								<RiCalendarEventLine size={12} className="text-primary" />
								Starts
							</span>
							<span className="text-[11px] font-bold uppercase truncate">
								{formatDateTime(auction.startDate)}
							</span>
						</div>
						<div className="bg-background p-4 flex flex-col gap-1">
							<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
								<RiCalendarEventLine size={12} className="text-primary" />
								Ends
							</span>
							<span className="text-[11px] font-bold uppercase truncate">
								{formatDateTime(auction.endDate)}
							</span>
						</div>
						<div className="bg-background p-4 flex flex-col gap-1">
							<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
								<RiAuctionLine size={12} className="text-primary" />
								Active Bids
							</span>
							<span className="text-[11px] font-bold uppercase">
								{auction.bidsCount || 0}
							</span>
						</div>
						<div className="bg-background p-4 flex flex-col gap-1">
							<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
								<RiHistoryLine size={12} className="text-primary" />
								Views
							</span>
							<span className="text-[11px] font-bold uppercase">
								{auction.views || 0}
							</span>
						</div>
					</div>
				</div>
			}
			tabs={
				<div className="space-y-6">
					<div className="space-y-3">
						<h3 className="text-sm font-black uppercase tracking-widest border-b border-border/40 pb-2">
							Description
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
							{auction.description || "No description provided."}
						</p>
					</div>
				</div>
			}
			sidebar={
				<div className="space-y-8">
					{auction.company && (
						<div className="space-y-3">
							<h3 className="text-sm font-black uppercase tracking-widest border-b border-border/40 pb-2">
								Listed By
							</h3>
							<div className="flex flex-col gap-4 bg-muted/20 p-4 border border-border/40">
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
										<RiStore2Line className="h-6 w-6 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-bold uppercase truncate">
											{auction.company.name}
										</p>
										<p className="text-xs text-muted-foreground">
											Vendor • {auction.company.district || "RW"}
										</p>
									</div>
								</div>
								<ContactActions
									phone={auction.company.phone}
									whatsapp={auction.company.phone}
									email={auction.company.email}
									companyName={auction.company.name}
									companyId={auction.company.id}
									auctionId={auction.id}
									size="sm"
								/>
								<Button
									variant="outline"
									className="h-9 w-full rounded-none text-[10px] font-black uppercase tracking-widest border-border/40"
									onClick={() =>
										navigate({
											to: "/suppliers/$supplierId",
											params: { supplierId: auction.company.id },
										})
									}
								>
									View Profile
								</Button>
							</div>
						</div>
					)}

					<div className="pt-6 border-t border-border/40">
						<Button
							onClick={() => setIsBidModalOpen(true)}
							className="w-full h-14 rounded-none text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
						>
							<RiMoneyDollarCircleLine className="mr-2 h-5 w-5" />
							Place Bid
						</Button>
					</div>
				</div>
			}
			modals={
				<PlaceBidModal
					auctionId={auction.id}
					startingPrice={auction.startingPrice}
					isOpen={isBidModalOpen}
					onClose={() => setIsBidModalOpen(false)}
				/>
			}
		/>
	);
}
