import { RiEyeLine, RiMoreLine, RiPhoneLine } from "@remixicon/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BuyerRow {
	id: string;
	name: string;
	email: string;
	role: string;
	phone: string;
	joinDate: string;
	status: "verified" | "unverified";
}

export const buyerColumns: ColumnDef<BuyerRow>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Buyer" />
		),
		cell: ({ row }) => (
			<div>
				<p className="text-sm font-heading font-bold text-foreground">
					{row.original.name}
				</p>
				<p className="text-[10px] text-muted-foreground">
					{row.original.email}
				</p>
			</div>
		),
	},
	{
		accessorKey: "phone",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contact" />
		),
		cell: ({ row }) => (
			<div className="flex w-fit items-center gap-1.5 rounded-sm border border-muted bg-muted/20 px-2 py-0.5">
				<RiPhoneLine size={12} className="text-muted-foreground" />
				<p className="text-xs font-mono font-bold text-foreground">
					{row.original.phone || "N/A"}
				</p>
			</div>
		),
	},
	{
		accessorKey: "role",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => (
			<Badge variant="outline" className="uppercase text-[10px] font-black">
				{row.original.role}
			</Badge>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<Badge
				variant={row.original.status === "verified" ? "success" : "secondary"}
				className="uppercase text-[10px] tracking-wider"
			>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "joinDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Joined" />
		),
	},
	{
		id: "actions",
		cell: () => (
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
						<DropdownMenuItem>
							<RiEyeLine className="mr-2 h-4 w-4" /> View details
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
