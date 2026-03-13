import {
	RiFilter3Line,
	RiSettings2Line,
} from "@remixicon/react";
import type { Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
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
import { cn } from "@/lib/utils";
import { useDataTable } from "@/components/ui/data-table";

type StatusOption = {
	label: string;
	value: string;
};

interface AdminTableToolbarProps<TData> {
	table?: Table<TData>;
	searchColumn?: string;
	searchPlaceholder?: string;
	statusColumn?: string;
	statusOptions?: StatusOption[];
	className?: string;
}

export function AdminTableToolbar<TData>({
	table: tableProp,
	searchColumn,
	searchPlaceholder = "Search...",
	statusColumn,
	statusOptions = [],
	className,
}: AdminTableToolbarProps<TData>) {
	const tableContext = useDataTable();
	const table = tableProp || tableContext;

	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const searchColumnInstance = searchColumn
		? table.getColumn(searchColumn)
		: undefined;
	const statusColumnInstance = statusColumn
		? table.getColumn(statusColumn)
		: undefined;

	const searchValue =
		(searchColumnInstance?.getFilterValue() as string) ?? "";
	const statusValue =
		(statusColumnInstance?.getFilterValue() as string) ?? "all";

	const hasActiveFilters = useMemo(() => {
		if (searchValue) return true;
		if (statusColumnInstance && statusValue !== "all") return true;
		return false;
	}, [searchValue, statusColumnInstance, statusValue]);

	const clearFilters = () => {
		searchColumnInstance?.setFilterValue("");
		statusColumnInstance?.setFilterValue(undefined);
	};

	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
				<div className="hidden lg:flex flex-1 items-center gap-3">
					{searchColumnInstance && (
						<Input
							placeholder={searchPlaceholder}
							value={searchValue}
							onChange={(event) =>
								searchColumnInstance.setFilterValue(event.target.value)
							}
							className="h-10 w-full max-w-[320px] rounded-none border-border/40 text-[10px] font-bold uppercase tracking-widest"
						/>
					)}
					{statusColumnInstance && statusOptions.length > 0 && (
						<Select
							value={statusValue}
							onValueChange={(value) =>
								statusColumnInstance.setFilterValue(
									value === "all" ? undefined : value,
								)
							}
						>
							<SelectTrigger className="h-10 w-[170px] rounded-none border-border/40 text-[10px] font-bold uppercase">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent className="rounded-none">
								<SelectItem
									value="all"
									className="text-[10px] uppercase font-bold"
								>
									All statuses
								</SelectItem>
								{statusOptions.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="text-[10px] uppercase font-bold"
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							className="h-10 px-3 rounded-none text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
							onClick={clearFilters}
						>
							Clear
						</Button>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
						<DrawerTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="lg:hidden h-10 rounded-none border-border/40 font-black uppercase text-[10px] tracking-widest"
							>
								<RiFilter3Line className="mr-2 h-4 w-4" />
								Filters
								{hasActiveFilters && (
									<span className="ml-2 h-2 w-2 rounded-full bg-primary" />
								)}
							</Button>
						</DrawerTrigger>
						<DrawerContent className="bg-background flex flex-col">
							<DrawerHeader className="border-b border-border/40 text-left">
								<DrawerTitle className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
									<RiFilter3Line className="h-4 w-4 text-primary" />
									Filters
								</DrawerTitle>
							</DrawerHeader>
							<div className="p-6 space-y-5">
								{searchColumnInstance && (
									<div className="space-y-2">
										<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
											Search
										</p>
										<Input
											placeholder={searchPlaceholder}
											value={searchValue}
											onChange={(event) =>
												searchColumnInstance.setFilterValue(event.target.value)
											}
											className="h-11 rounded-none border-border/40 text-[10px] font-bold uppercase tracking-widest"
										/>
									</div>
								)}
								{statusColumnInstance && statusOptions.length > 0 && (
									<div className="space-y-2">
										<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
											Status
										</p>
										<Select
											value={statusValue}
											onValueChange={(value) =>
												statusColumnInstance.setFilterValue(
													value === "all" ? undefined : value,
												)
											}
										>
											<SelectTrigger className="h-11 rounded-none border-border/40 text-[10px] font-bold uppercase">
												<SelectValue placeholder="All statuses" />
											</SelectTrigger>
											<SelectContent className="rounded-none">
												<SelectItem
													value="all"
													className="text-[10px] uppercase font-bold"
												>
													All statuses
												</SelectItem>
												{statusOptions.map((option) => (
													<SelectItem
														key={option.value}
														value={option.value}
														className="text-[10px] uppercase font-bold"
													>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
							{hasActiveFilters && (
								<DrawerFooter className="border-t border-border/40 bg-muted/5">
									<Button
										variant="ghost"
										size="sm"
										className="h-10 w-full rounded-none text-[9px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5 border border-destructive/20"
										onClick={() => {
											clearFilters();
											setIsFiltersOpen(false);
										}}
									>
										Clear Filters
									</Button>
								</DrawerFooter>
							)}
						</DrawerContent>
					</Drawer>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="outline"
									size="sm"
									className="hidden lg:flex h-10 rounded-none border-border/40 font-black uppercase text-[10px] tracking-widest"
								>
									<RiSettings2Line className="mr-2 h-4 w-4" />
									Columns
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuGroup>
								<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{table
									.getAllColumns()
									.filter(
										(column) =>
											typeof column.accessorFn !== "undefined" &&
											column.getCanHide(),
									)
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
