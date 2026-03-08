import { memo, useId } from "react";
import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { CatalogFilters } from "@/types";

const COMPANY_TYPE_LABELS: Record<string, string> = {
	SUPPLIER_DEALER: "Dealer",
	SUPPLIER_RETAILER: "Retailer",
	SUPPLIER_WHOLESALER: "Wholesaler/Importer",
	MANUFACTURER_RWANDA: "Factory (Rwanda)",
	MANUFACTURER_EAC: "Factory (EAC)",
	SERVICE_PROVIDER: "Service Provider",
};

interface FilterPanelProps {
	filters: CatalogFilters;
	categories: Array<{ id: string; name: string }>;
	priceRange: [number, number];
	onPriceRangeChange: (value: [number, number]) => void;
	onPriceCommit: () => void;
	onFilterChange: (patch: Partial<CatalogFilters>) => void;
}

export const FilterPanel = memo<FilterPanelProps>(
	({
		filters,
		categories,
		priceRange,
		onPriceRangeChange,
		onPriceCommit,
		onFilterChange,
	}) => {
		const stockToggleId = useId();

		return (
			<div className="space-y-5 p-1">
				{/* Category */}
				<div className="space-y-2">
					<Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-[0.2em] block">
						Category
					</Label>
					<Select
						value={filters.categoryId}
						onValueChange={(val) =>
							onFilterChange({ categoryId: val ?? undefined, page: 1 })
						}
					>
						<SelectTrigger className="w-full bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-9">
							<SelectValue placeholder="All Categories">
								{filters.categoryId === "all" || !filters.categoryId
									? "All Categories"
									: categories.find(
											(c) => String(c.id) === String(filters.categoryId),
										)?.name || filters.categoryId}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className="rounded-none border-border/20">
							<SelectItem
								value="all"
								className="rounded-none text-[10px] uppercase tracking-widest"
							>
								All Categories
							</SelectItem>
							{categories.map((c) => (
								<SelectItem
									key={c.id}
									value={c.id}
									className="rounded-none text-[10px] uppercase tracking-widest"
								>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Separator className="opacity-10" />

				{/* Company Type */}
				<div className="space-y-2">
					<Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-[0.2em] block">
						Supplier Type
					</Label>
					<Select
						value={filters.companyType}
						onValueChange={(val) =>
							onFilterChange({ companyType: val ?? undefined, page: 1 })
						}
					>
						<SelectTrigger className="w-full bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-9">
							<SelectValue placeholder="All Types">
								{filters.companyType === "all" || !filters.companyType
									? "All Types"
									: COMPANY_TYPE_LABELS[filters.companyType] ||
										filters.companyType}
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

				<Separator className="opacity-10" />

				{/* Sort */}
				<div className="space-y-2">
					<Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-[0.2em] block">
						Sorting
					</Label>
					<div className="flex gap-1.5">
						<Select
							value={filters.sortBy}
							onValueChange={(val) =>
								onFilterChange({ sortBy: val ?? undefined, page: 1 })
							}
						>
							<SelectTrigger className="flex-1 bg-background rounded-none border-border/20 font-display font-medium uppercase tracking-widest text-[10px] h-9">
								<SelectValue placeholder="Sorting">
									{filters.sortBy === "createdAt"
										? "Newest"
										: filters.sortBy === "price"
											? "Price"
											: filters.sortBy === "name"
												? "Name"
												: "Sorting"}
								</SelectValue>
							</SelectTrigger>
							<SelectContent className="rounded-none border-border/20">
								<SelectItem
									value="createdAt"
									className="rounded-none text-[10px] font-bold uppercase tracking-widest"
								>
									Newest
								</SelectItem>
								<SelectItem
									value="price"
									className="rounded-none text-[10px] font-bold uppercase tracking-widest"
								>
									Price
								</SelectItem>
								<SelectItem
									value="name"
									className="rounded-none text-[10px] font-bold uppercase tracking-widest"
								>
									Name
								</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="sm"
							className="shrink-0 px-2 rounded-none border-border/20 h-9"
							onClick={() =>
								onFilterChange({
									sortOrder: filters.sortOrder === "ASC" ? "DESC" : "ASC",
									page: 1,
								})
							}
						>
							{filters.sortOrder === "ASC" ? "↑" : "↓"}
						</Button>
					</div>
				</div>

				<Separator className="opacity-10" />

				{/* Price Range */}
				<div className="space-y-3">
					<Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-[0.2em] block">
						Price Range
					</Label>
					<Slider
						value={priceRange}
						max={2_000_000}
						step={10_000}
						onValueChange={(val) => onPriceRangeChange(val as [number, number])}
						onValueCommitted={onPriceCommit}
						className="py-2"
					/>
					<div className="flex items-center justify-between text-[8px] font-bold text-primary uppercase tracking-widest">
						<span>{priceRange[0].toLocaleString()} RWF</span>
						<span>{priceRange[1].toLocaleString()}+ RWF</span>
					</div>
					<div className="flex gap-1.5">
						<Input
							type="number"
							placeholder="Min"
							value={priceRange[0] || ""}
							onChange={(e) =>
								onPriceRangeChange([Number(e.target.value), priceRange[1]])
							}
							className="h-8 bg-background rounded-none border-border/20 text-[10px] font-bold uppercase tracking-widest"
						/>
						<Input
							type="number"
							placeholder="Max"
							value={priceRange[1] || ""}
							onChange={(e) =>
								onPriceRangeChange([priceRange[0], Number(e.target.value)])
							}
							className="h-8 bg-background rounded-none border-border/20 text-[10px] font-bold uppercase tracking-widest"
						/>
					</div>
				</div>

				<Separator className="opacity-10" />

				{/* District */}
				<div className="space-y-2">
					<Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-[0.2em] block">
						District
					</Label>
					<Input
						placeholder="Search District..."
						value={filters.district}
						onChange={(e) =>
							onFilterChange({ district: e.target.value, page: 1 })
						}
						className="h-9 bg-background rounded-none border-border/20 text-[10px] font-bold uppercase tracking-widest placeholder:text-muted-foreground/30"
					/>
				</div>

				<Separator className="opacity-10" />

				{/* In Stock */}
				<div className="flex items-center justify-between border p-3 rounded-none border-border/20 bg-muted/5">
					<Label
						htmlFor={stockToggleId}
						className="text-[10px] font-bold uppercase tracking-widest cursor-pointer"
					>
						Available Now
					</Label>
					<Switch
						id={stockToggleId}
						className="rounded-none scale-75"
						checked={filters.onlyInStock}
						onCheckedChange={(checked) =>
							onFilterChange({ onlyInStock: checked, page: 1 })
						}
					/>
				</div>
			</div>
		);
	},
);

FilterPanel.displayName = "FilterPanel";
