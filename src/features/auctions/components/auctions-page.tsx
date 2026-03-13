import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuctionsGrid } from "./auctions-grid";
import { useAuctionsFilters } from "@/hooks/use-auctions-filters";

export function AuctionsPage() {
  const { searchInput, setSearchInput, filters, patchFilters } =
    useAuctionsFilters();
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border sticky top-[48px] z-30 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none">
                Auctions
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-primary" />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
                  Live Bidding Events
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end max-w-xl">
              <div className="relative flex-1 group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="SEARCH AUCTIONS..."
                  className="pl-10 bg-muted/20 border-border/40 rounded-none focus:bg-background focus:ring-0 focus:border-primary/60 h-10 w-full font-display font-medium text-xs transition-all"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              <div className="hidden md:flex items-center bg-muted/20 border border-border/10 p-0.5 rounded-none h-10">
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(val) => {
                    const [sortBy, sortOrder] = (val || "-").split("-");
                    patchFilters({ sortBy, sortOrder });
                  }}
                >
                  <SelectTrigger className="h-full rounded-none border-0 bg-transparent ring-0 focus:ring-0 gap-2 px-3 text-xs font-medium w-[140px]">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border/40 shadow-xl">
                    <SelectItem value="createdAt-DESC" className="text-xs">
                      Newest First
                    </SelectItem>
                    <SelectItem value="createdAt-ASC" className="text-xs">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="startingPrice-ASC" className="text-xs">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="startingPrice-DESC" className="text-xs">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-px h-6 bg-border/40 mx-1 hidden sm:block" />
              </div>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden rounded-none border-border/40 h-9 font-black uppercase text-[10px] tracking-widest px-4 gap-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </Button>
                </DrawerTrigger>
								<DrawerContent className="bg-background flex flex-col">
									<DrawerHeader className="p-6 border-b border-border/40 shrink-0 text-left">
										<DrawerTitle className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
											<SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
											Auction Filters
										</DrawerTitle>
									</DrawerHeader>
									<div className="p-6 space-y-4">
										<Select
											value={`${filters.sortBy}-${filters.sortOrder}`}
											onValueChange={(val) => {
												const [sortBy, sortOrder] = (val || "-").split("-");
												patchFilters({ sortBy, sortOrder });
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-none border-border/40 text-[10px] uppercase font-bold">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border/40 shadow-xl">
                        <SelectItem value="createdAt-DESC" className="text-xs">
                          Newest First
                        </SelectItem>
                        <SelectItem value="createdAt-ASC" className="text-xs">
                          Oldest First
                        </SelectItem>
                        <SelectItem
                          value="startingPrice-ASC"
                          className="text-xs"
                        >
                          Price: Low to High
                        </SelectItem>
                        <SelectItem
                          value="startingPrice-DESC"
                          className="text-xs"
                        >
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
				<div className="md:hidden mb-6 relative group">
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
    </div>
  );
}
