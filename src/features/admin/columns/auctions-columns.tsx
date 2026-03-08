import {
	RiAuctionLine,
	RiCheckLine,
	RiCloseLine,
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
import type { Auction } from "@/types";

interface AuctionColumnsProps {
	onViewSupplier: (supplierId: string) => void;
	onApprove: (auction: Auction) => void;
	onReject: (auction: Auction) => void;
}

export const getAuctionColumns = ({
	onViewSupplier,
	onApprove,
	onReject,
}: AuctionColumnsProps): ColumnDef<Auction>[] => [
	{
		accessorKey: "title",
		header: "Auction",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="rounded-sm border border-orange-100 bg-orange-50 p-2">
					<RiAuctionLine size={16} className="text-orange-600" />
				</div>
				<div>
					<p className="font-heading font-bold text-foreground">
						{row.original.title}
					</p>
					<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
						Starting: {row.original.startingPrice.toLocaleString()} RWF
					</p>
				</div>
			</div>
		),
	},
	{
		accessorKey: "company",
		header: "Supplier",
		cell: ({ row }) => (
			<span className="text-xs font-semibold text-foreground">
				{row.original.company?.name || "Unknown"}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			const variant =
				status === "APPROVED"
					? "success"
					: status === "REJECTED"
						? "destructive"
						: "secondary";

			return (
				<Badge
					variant={variant}
					className="uppercase text-[10px] tracking-wider"
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">
				{new Date(row.original.startDate).toLocaleDateString()}
			</span>
		),
	},
	{
		accessorKey: "endDate",
		header: "End Date",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">
				{new Date(row.original.endDate).toLocaleDateString()}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const isPending = row.original.status === "PENDING";
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
							<DropdownMenuItem
								disabled={!row.original.company?.id}
								onClick={() => onViewSupplier(row.original.company.id)}
							>
								<RiEyeLine className="mr-2 h-4 w-4" /> View supplier
							</DropdownMenuItem>

							{isPending && (
								<>
									<DropdownMenuItem
										className="text-emerald-600 focus:text-emerald-600"
										onClick={() => onApprove(row.original)}
									>
										<RiCheckLine className="mr-2 h-4 w-4" /> Approve
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => onReject(row.original)}
									>
										<RiCloseLine className="mr-2 h-4 w-4" /> Reject
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
