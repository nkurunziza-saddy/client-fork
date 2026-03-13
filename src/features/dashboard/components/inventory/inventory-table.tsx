import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card as AdminCard } from "@/shared/components/admin/card";
import type { MarketplaceItem } from "@/types";

interface InventoryTableProps {
  listings: MarketplaceItem[];
  onDeleteClick: (listing: MarketplaceItem) => void;
}

export function InventoryTable({
  listings,
  onDeleteClick,
}: InventoryTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "PENDING">(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PRODUCT" | "SERVICE">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { filteredListings, paginatedListings, totalPages } = (() => {
    const filtered = listings.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "LIVE"
            ? l.isActive
            : !l.isActive;
      const matchType = typeFilter === "ALL" ? true : l.itemType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });

    const maxPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, maxPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      filteredListings: filtered,
      paginatedListings: paginated,
      totalPages: maxPages,
    };
  })();

  return (
    <AdminCard title="Inventory" subtitle="Active listings" noPadding>
      {listings.length === 0 ? (
        <div className="py-20 border-t border-border">
          <Empty className="max-w-md mx-auto">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package className="w-4 h-4 text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-xl font-display font-black uppercase">
                No listings found
              </EmptyTitle>
              <EmptyDescription className="uppercase tracking-widest text-[10px]">
                You haven't created any listings yet. Start by adding your first
                product or service.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary rounded-none h-11 px-8"
                onClick={() => navigate({ to: "/dashboard/listings/new" })}
              >
                Create first listing
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="border-t border-border">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border/40 bg-muted/10">
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="h-9 text-xs rounded-none border-border/40 sm:max-w-[200px]"
            />
            <Select
              value={typeFilter}
              onValueChange={(v: string | null) => {
                if (v) setTypeFilter(v as "ALL" | "PRODUCT" | "SERVICE");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs rounded-none border-border/40 sm:max-w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="PRODUCT">Products</SelectItem>
                <SelectItem value="SERVICE">Services</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v: string | null) => {
                if (v) setStatusFilter(v as "ALL" | "LIVE" | "PENDING");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs rounded-none border-border/40 sm:max-w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="LIVE">Live</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* mobile card view */}
          <div className="block md:hidden divide-y divide-border/40">
            {paginatedListings.length === 0 ? (
              <div className="p-12">
                <Empty className="border-none p-0 gap-2">
                  <EmptyHeader>
                    <EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      No matches found
                    </EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              paginatedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-4 active:bg-muted/50 transition-colors"
                  onClick={() =>
                    navigate({
                      to: `/dashboard/listings/${listing.id}/edit`,
                      search: { type: listing.itemType },
                    })
                  }
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                        {listing.itemType}
                      </p>
                      <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">
                        {listing.name}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-muted-foreground/40 mt-0.5">
                        ID: {listing.id.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          listing.isActive ? "bg-success" : "bg-warning",
                        )}
                      />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {listing.isActive ? "Live" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-[9px] font-black uppercase tracking-widest rounded-none border-border/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                          to: `/dashboard/listings/${listing.id}/edit`,
                          search: { type: listing.itemType },
                        });
                      }}
                    >
                      <RiEditLine className="mr-1.5 h-3 w-3" /> Edit
                    </Button>
                    <Button
                      data-testid="delete-listing-button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-[9px] font-black uppercase tracking-widest rounded-none border-border/40 text-destructive hover:bg-destructive/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(listing);
                      }}
                    >
                      <RiDeleteBinLine className="mr-1.5 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Listing Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedListings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12">
                      <Empty className="border-none p-0 gap-2">
                        <EmptyHeader>
                          <EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                            No matches found
                          </EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </td>
                  </tr>
                ) : (
                  paginatedListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                      onClick={() =>
                        navigate({
                          to: `/dashboard/listings/${listing.id}/edit`,
                          search: { type: listing.itemType },
                        })
                      }
                    >
                      <td className="px-6 py-4">
                        <p className="font-display font-black text-sm uppercase tracking-tight text-foreground">
                          {listing.name}
                        </p>
                        <p className="text-[10px] font-mono font-bold text-muted-foreground/40">
                          {listing.id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase tracking-[0.2em] rounded-none border-primary/20 bg-primary/5 text-primary"
                        >
                          {listing.itemType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              listing.isActive ? "bg-success" : "bg-warning",
                            )}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                            {listing.isActive ? "Live" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none hover:bg-primary/5 hover:text-primary"
                            onClick={() =>
                              navigate({
                                to: `/dashboard/listings/${listing.id}/edit`,
                                search: { type: listing.itemType },
                              })
                            }
                          >
                            <RiEditLine className="h-4 w-4" />
                          </Button>
                          <Button
                            data-testid="delete-listing-button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none hover:bg-destructive/5 hover:text-destructive"
                            onClick={() => onDeleteClick(listing)}
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
                Showing{" "}
                {Math.min((page - 1) * pageSize + 1, filteredListings.length)}{" "}
                to {Math.min(page * pageSize, filteredListings.length)} of{" "}
                {filteredListings.length} entries
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest sm:hidden">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-none text-[9px] uppercase font-bold tracking-widest"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-none text-[9px] uppercase font-bold tracking-widest"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminCard>
  );
}
