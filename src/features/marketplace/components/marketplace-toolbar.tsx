import { LayoutGrid, List, Search } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MarketplaceToolbarProps {
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onToggleFilters?: () => void;
	showFilters?: boolean;
}

export const MarketplaceToolbar: React.FC<MarketplaceToolbarProps> = ({
	viewMode,
	onViewModeChange,
	searchQuery,
	onSearchChange,
}) => {
	return (
		<div className="flex flex-col gap-4 mb-8">
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 grow">
					<div className="relative flex-1 group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
						<Input
							placeholder="SEARCH..."
							className="pl-11 bg-muted/10 border-border/40 rounded-none focus:ring-0 focus:border-primary/60 h-10 w-full font-display font-bold uppercase tracking-wider text-[10px] transition-all"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex items-center bg-muted/20 border border-border/10 p-0.5 rounded-none hidden sm:flex h-10">
					<Button
						variant={viewMode === "grid" ? "secondary" : "ghost"}
						size="icon"
						className="rounded-none h-8 w-8"
						onClick={() => onViewModeChange("grid")}
					>
						<LayoutGrid className="w-3.5 h-3.5" />
					</Button>
					<Button
						variant={viewMode === "list" ? "secondary" : "ghost"}
						size="icon"
						className="rounded-none h-8 w-8"
						onClick={() => onViewModeChange("list")}
					>
						<List className="w-3.5 h-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
};
