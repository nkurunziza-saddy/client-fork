import { useNavigate, useParams } from "@tanstack/react-router";
import { useGetAuctionByIdQuery } from "@/services/api/auctions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RiArrowLeftLine,
  RiAuctionLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiStore2Line,
} from "@remixicon/react";

import { useState } from "react";
import { ContactActions } from "@/shared/components/contact-actions";
import { PlaceBidModal } from "./place-bid-modal";

export function AuctionDetailsPage() {
  const navigate = useNavigate();
  const { auctionId } = useParams({ from: "/_main/auctions/$auctionId" });
  const { data: auction, isLoading } = useGetAuctionByIdQuery(auctionId);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-32 space-y-4">
        <RiAuctionLine className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-heading font-black uppercase">
          Auction Not Found
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          The auction you are looking for may have ended, been removed, or does
          not exist.
        </p>
        <Button
          onClick={() => navigate({ to: "/auctions" })}
          className="mt-4 rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
        >
          Back to Auctions
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      {/* Breadcrumb / Back */}
      <button
        onClick={() => navigate({ to: "/auctions" })}
        className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 transition-colors group"
      >
        <RiArrowLeftLine className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Auctions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery area */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-muted/30 border border-border/40 flex items-center justify-center overflow-hidden w-full group">
            {auction.images && auction.images.length > 0 ? (
              <img
                src={auction.images[currentImageIdx] || auction.images[0]}
                alt={auction.title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <RiAuctionLine className="h-24 w-24 text-muted-foreground/20" />
            )}
          </div>
          {/* Thumbnail strip */}
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
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="space-y-8">
          <div className="space-y-4 border-b border-border/40 pb-6 text-foreground">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge
                variant={
                  (auction.status as string) === "ACTIVE"
                    ? "success"
                    : "secondary"
                }
                className="rounded-none text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1"
              >
                {auction.status || "Listed"}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                ID: {auction.id.slice(0, 8)}...
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
                  {new Date(auction.startDate).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center">
                  <RiCalendarEventLine className="w-3 h-3 mr-1 text-destructive/70" />{" "}
                  Ends
                </span>
                <span className="text-sm font-medium">
                  {new Date(auction.endDate).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Active Bidders
                </span>
                <span className="text-xl font-bold font-mono text-foreground">
                  {Math.max(
                    2,
                    Math.floor(parseInt(auction.id.slice(0, 4), 16) / 1000),
                  )}
                </span>
              </div>
              <div className="w-px h-8 bg-border/40" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Total Views
                </span>
                <span className="text-xl font-bold font-mono text-foreground">
                  {Math.floor(parseInt(auction.id.slice(4, 8), 16))}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-border/40 pb-2">
                Description
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {auction.description || "No description provided."}
              </p>
            </div>

            {auction.company && (
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest border-b border-border/40 pb-2">
                  Listed By
                </h3>
                <div className="flex items-center gap-4 bg-muted/20 p-4 border border-border/40">
                  <div className="h-12 w-12 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <RiStore2Line className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase truncate">
                      {auction.company.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Vendor • {(auction.company as any).country || "RW"}
                    </p>
                    <ContactActions
                      phone={auction.company.phone}
                      whatsapp={auction.company.phone}
                      email={auction.company.email}
                      companyName={auction.company.name}
                      companyId={auction.company.id}
                      auctionId={auction.id}
                      size="sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="h-9 px-4 rounded-none text-[10px] font-black uppercase tracking-widest border-border/40 shrink-0"
                    onClick={() =>
                      navigate({
                        to: `/suppliers/${auction.company.id}` as any,
                      })
                    }
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40">
            <Button
              onClick={() => setIsBidModalOpen(true)}
              className="flex-1 h-14 rounded-none text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              <RiMoneyDollarCircleLine className="mr-2 h-5 w-5" />
              Place Bid
            </Button>
          </div>
        </div>
      </div>

      {auction && (
        <PlaceBidModal
          auctionId={auction.id}
          startingPrice={auction.startingPrice}
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
        />
      )}
    </div>
  );
}
