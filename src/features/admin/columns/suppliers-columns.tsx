import {
	RiCheckboxCircleLine,
	RiDeleteBinLine,
	RiEditLine,
	RiErrorWarningLine,
	RiEyeLine,
	RiMoreLine,
} from "@remixicon/react";
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
import type { SupplierRow } from "@/types";

interface SuppliersColumnsProps {
	onViewDetails: (id: string) => void;
	onEdit: (id: string) => void;
	onSuspend: (id: string, name: string, status: string) => void;
	onDelete: (id: string, name: string) => void;
}

export const getSuppliersColumns = ({
	onViewDetails,
	onEdit,
	onSuspend,
	onDelete,
}: SuppliersColumnsProps): ColumnDef<SupplierRow>[] => [
	{
		accessorKey: "name",
		header: "Supplier Name",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-sm bg-muted font-heading font-black text-primary text-sm border border-border">
					{row.original.name.charAt(0)}
				</div>
				<div>
					<p className="font-heading font-bold text-foreground leading-none mb-1">
						{row.original.name}
					</p>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
							{row.original.type}
						</span>
						{row.original.isVerified && (
							<RiCheckboxCircleLine className="h-3 w-3 text-success" />
						)}
					</div>
				</div>
			</div>
		),
	},
	{
		accessorKey: "district",
		header: "Location",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">
				{row.original.district}
			</span>
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
		id: "actions",
		cell: ({ row }) => {
			const supplier = row.original;
			return (
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
							<DropdownMenuItem onClick={() => onViewDetails(supplier.id)}>
								<RiEyeLine className="mr-2 h-4 w-4" /> View profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onEdit(supplier.id)}>
								<RiEditLine className="mr-2 h-4 w-4" /> Edit details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									onSuspend(supplier.id, supplier.name, supplier.status)
								}
							>
								<RiErrorWarningLine className="mr-2 h-4 w-4" />{" "}
								{supplier.status === "active" ? "Suspend" : "Activate"}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => onDelete(supplier.id, supplier.name)}
							>
								<RiDeleteBinLine className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
