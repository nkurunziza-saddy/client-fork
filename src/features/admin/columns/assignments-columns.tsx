import { RiEyeLine, RiLinkM, RiMoreLine } from "@remixicon/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AssignmentRow } from "@/types";

interface AssignmentColumnsProps {
	onViewSupplier: (supplierId: string) => void;
	onViewService: (serviceId: string) => void;
}

export const getAssignmentColumns = ({
	onViewSupplier,
	onViewService,
}: AssignmentColumnsProps): ColumnDef<AssignmentRow>[] => [
	{
		accessorKey: "supplier",
		header: "Supplier",
		cell: ({ row }) => (
			<p className="text-sm font-heading font-bold text-foreground">
				{row.original.supplier}
			</p>
		),
	},
	{
		accessorKey: "service",
		header: "Service",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<div className="rounded-sm border border-info/20 bg-info/5 p-1.5">
					<RiLinkM size={12} className="text-info" />
				</div>
				<span className="text-xs font-semibold text-foreground">
					{row.original.service}
				</span>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge
				variant={row.original.status === "active" ? "success" : "secondary"}
				className="uppercase text-[10px] tracking-wider"
			>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "assignedDate",
		header: "Assigned",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">
				{row.original.assignedDate}
			</span>
		),
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => (
			<span className="text-xs font-semibold text-foreground">
				RWF {row.original.price.toLocaleString()}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<RiMoreLine className="h-4 w-4" />
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => onViewSupplier(row.original.supplierId)}
						>
							<RiEyeLine className="mr-2 h-4 w-4" /> View supplier
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onViewService(row.original.id)}>
							<RiEyeLine className="mr-2 h-4 w-4" /> View service
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
