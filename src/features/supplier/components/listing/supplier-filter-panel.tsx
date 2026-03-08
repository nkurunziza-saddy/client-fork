import { ShieldCheck } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { SupplierFiltersState } from "@/types";

const COMPANY_TYPE_LABELS: Record<string, string> = {
	SUPPLIER_DEALER: "Dealer",
	SUPPLIER_RETAILER: "Retailer",
	SUPPLIER_WHOLESALER: "Wholesaler/Importer",
	MANUFACTURER_RWANDA: "Factory (Rwanda)",
	MANUFACTURER_EAC: "Factory (EAC)",
	SERVICE_PROVIDER: "Service Provider",
};

interface SupplierFilterPanelProps {
	filters: SupplierFiltersState;
	categories: Array<{ id: string; name: string }>;
	onFilterChange: (updates: Partial<SupplierFiltersState>) => void;
}

export const SupplierFilterPanel: React.FC<SupplierFilterPanelProps> = ({
	filters,
	categories,
	onFilterChange,
}) => {
	const verifiedId = useId();

	return (
		<div className="space-y-6 p-1">
			{/* Category */}
			<div className="space-y-4">
				<Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider block mb-2">
					Category
				</Label>
				<Select
					value={filters.categoryId}
					onValueChange={(val) => onFilterChange({ categoryId: val as string })}
				>
					<SelectTrigger className="w-full bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-10">
						<SelectValue placeholder="All Categories">
							{filters.categoryId === "all" || !filters.categoryId
								? "All Categories"
								: categories.find(
										(c) => String(c.id) === String(filters.categoryId),
									)?.name || filters.categoryId}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className="rounded-none border-border/20">
						<SelectItem value="all" className="rounded-none">
							All Categories
						</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={cat.id} className="rounded-none">
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Separator />

			{/* Company Type */}
			<div className="space-y-4">
				<Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider block mb-2">
					Business Type
				</Label>
				<Select
					value={filters.type}
					onValueChange={(val) => onFilterChange({ type: val as string })}
				>
					<SelectTrigger className="w-full bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-10">
						<SelectValue placeholder="All Types">
							{filters.type === "all" || !filters.type
								? "All Types"
								: COMPANY_TYPE_LABELS[filters.type] || filters.type}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className="rounded-none border-border/20">
						<SelectItem
							value="all"
							className="rounded-none text-[10px] uppercase tracking-widest"
						>
							All Types
						</SelectItem>
						<SelectGroup>
							<SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
								Supplier
							</SelectLabel>
							<SelectItem
								value="SUPPLIER_DEALER"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Dealer
							</SelectItem>
							<SelectItem
								value="SUPPLIER_RETAILER"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Retailer
							</SelectItem>
							<SelectItem
								value="SUPPLIER_WHOLESALER"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Wholesaler/Importer
							</SelectItem>
						</SelectGroup>
						<SelectGroup>
							<SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
								Manufacturer
							</SelectLabel>
							<SelectItem
								value="MANUFACTURER_RWANDA"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Factory (Rwanda)
							</SelectItem>
							<SelectItem
								value="MANUFACTURER_EAC"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Factory (EAC)
							</SelectItem>
						</SelectGroup>
						<SelectGroup>
							<SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
								Service
							</SelectLabel>
							<SelectItem
								value="SERVICE_PROVIDER"
								className="rounded-none text-[9px] uppercase tracking-widest pl-7"
							>
								Service Provider
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<Separator />

			{/* Location */}
			<div className="space-y-4">
				<Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider block mb-2">
					Location (District)
				</Label>
				<Input
					placeholder="e.g. Gasabo, Kicukiro"
					value={filters.district}
					onChange={(e) => onFilterChange({ district: e.target.value })}
					className="bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-10 placeholder:text-muted-foreground/30"
				/>
			</div>

			<Separator />

			{/* Rating */}
			<div className="space-y-4">
				<Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider block mb-2">
					Min Rating
				</Label>
				<Select
					value={filters.minRating}
					onValueChange={(val) => onFilterChange({ minRating: val as string })}
				>
					<SelectTrigger className="w-full bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-10">
						<SelectValue placeholder="Any Rating">
							{filters.minRating === "0" || !filters.minRating
								? "Any Rating"
								: filters.minRating === "5"
									? "5 Stars"
									: `${filters.minRating}+ Stars`}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className="rounded-none border-border/20">
						<SelectItem value="0" className="rounded-none">
							Any Rating
						</SelectItem>
						<SelectItem value="4" className="rounded-none">
							4+ Stars
						</SelectItem>
						<SelectItem value="4.5" className="rounded-none">
							4.5+ Stars
						</SelectItem>
						<SelectItem value="5" className="rounded-none">
							5 Stars
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Separator />

			{/* Verified Only */}
			<div className="flex items-center justify-between space-x-2 border p-4 rounded-none border-border/20 bg-muted/5">
				<Label
					htmlFor={verifiedId}
					className="text-[10px] font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 text-foreground/70"
				>
					<ShieldCheck className="w-3.5 h-3.5 text-primary" />
					Verified Only
				</Label>
				<Switch
					id={verifiedId}
					className="rounded-none scale-90"
					checked={filters.verified}
					onCheckedChange={(checked) => onFilterChange({ verified: checked })}
				/>
			</div>
		</div>
	);
};
