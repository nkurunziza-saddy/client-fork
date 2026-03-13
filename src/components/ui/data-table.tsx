import {
	RiArrowLeftDoubleLine,
	RiArrowLeftSLine,
	RiArrowRightDoubleLine,
	RiArrowRightSLine,
	RiSettings2Line,
} from "@remixicon/react";
import type {
	ColumnDef,
	ColumnFiltersState,
	OnChangeFn,
	PaginationState,
	SortingState,
	Table as TableInstance,
	VisibilityState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
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
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// --- Context ---

const DataTableContext = React.createContext<TableInstance<any> | null>(null);

export function useDataTable() {
	const context = React.useContext(DataTableContext);
	if (!context) {
		throw new Error("useDataTable must be used within a DataTable");
	}
	return context;
}

// --- Components ---

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	children?: React.ReactNode;
	className?: string;
	pageCount?: number;
	manualPagination?: boolean;
	onPaginationChange?: OnChangeFn<PaginationState>;
	state?: {
		pagination?: PaginationState;
	};
}

export function DataTableRoot<TData, TValue>({
	columns,
	data,
	children,
	className,
	pageCount,
	manualPagination,
	onPaginationChange,
	state: externalState,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: manualPagination
			? undefined
			: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: onPaginationChange || setPagination,
		manualPagination,
		pageCount,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: externalState?.pagination || pagination,
		},
	});

	return (
		<DataTableContext.Provider value={table as any}>
			<div className={cn("space-y-4", className)}>{children}</div>
		</DataTableContext.Provider>
	);
}

function DataTableToolbar({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4",
				className,
			)}
		>
			{children}
		</div>
	);
}

function DataTableSearch({
	column,
	placeholder = "Filter...",
	className,
}: { column: string; placeholder?: string; className?: string }) {
	const table = useDataTable();
	const col = table.getColumn(column);

	if (!col) return null;

	return (
		<Input
			placeholder={placeholder}
			value={(col.getFilterValue() as string) ?? ""}
			onChange={(event) => col.setFilterValue(event.target.value)}
			className={cn(
				"h-9 w-full sm:w-[250px] rounded-none border-border/40 text-[10px] font-bold uppercase tracking-widest",
				className,
			)}
		/>
	);
}

function DataTableColumnVisibility({ className }: { className?: string }) {
	const table = useDataTable();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"hidden lg:flex h-9 rounded-none border-border/40 font-black uppercase text-[10px] tracking-widest",
							className,
						)}
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
								typeof column.accessorFn !== "undefined" && column.getCanHide(),
						)
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							);
						})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DataTableContent({ className }: { className?: string }) {
	const table = useDataTable();
	const columns = table.getAllColumns();

	return (
		<div
			className={cn(
				"rounded-none border border-border/40 overflow-hidden",
				className,
			)}
		>
			<div className="overflow-x-auto custom-scrollbar">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-muted/20">
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap py-4"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/10 transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-4 whitespace-nowrap">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-48">
									<Empty className="border-none bg-transparent gap-2">
										<EmptyHeader>
											<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
												No results found
											</EmptyTitle>
										</EmptyHeader>
									</Empty>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function DataTablePagination({ className }: { className?: string }) {
	const table = useDataTable();

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-center justify-between gap-4 px-2",
				className,
			)}
		>
			<div className="hidden sm:block flex-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} record(s) active
			</div>
			<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
				<div className="flex items-center space-x-2">
					<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
						Display:
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px] rounded-none border-border/40 text-[10px] font-bold">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top" className="rounded-none">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
									className="text-[10px] uppercase font-bold"
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center text-[10px] font-black uppercase tracking-widest min-w-[80px]">
						Page {table.getState().pagination.pageIndex + 1} /{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-1">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex rounded-none border-border/40"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">First</span>
							<RiArrowLeftDoubleLine className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0 rounded-none border-border/40"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Prev</span>
							<RiArrowLeftSLine className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0 rounded-none border-border/40"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Next</span>
							<RiArrowRightSLine className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex rounded-none border-border/40"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Last</span>
							<RiArrowRightDoubleLine className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Composite Export ---

export const DataTable = Object.assign(DataTableRoot, {
	Toolbar: DataTableToolbar,
	Search: DataTableSearch,
	ColumnVisibility: DataTableColumnVisibility,
	Content: DataTableContent,
	Pagination: DataTablePagination,
});
