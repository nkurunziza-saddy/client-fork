import { RiAddLine, RiAuctionLine, RiDeleteBinLine } from "@remixicon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	useDeleteAuctionMutation,
	useGetAuctionsQuery,
} from "@/services/api/auctions";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { StatCard } from "@/shared/components/admin/stat-card";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";

export const Route = createFileRoute("/dashboard/auctions/")({
	component: SupplierAuctionsPage,
});

function SupplierAuctionsPage() {
	const navigate = useNavigate();
	const { data: company } = useGetMyCompanyQuery();
	const { data: auctionsResult, isLoading } = useGetAuctionsQuery(
		{ companyId: company?.id, limit: 100 },
		{ skip: !company?.id },
	);
	const [deleteAuction, { isLoading: isDeleting }] = useDeleteAuctionMutation();
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		auctionId: "",
		auctionTitle: "",
	});

	const auctions = auctionsResult?.data || [];

	const handleDelete = async () => {
		try {
			await deleteAuction(deleteModal.auctionId).unwrap();
			toast.success("Auction deleted successfully");
			setDeleteModal({ isOpen: false, auctionId: "", auctionTitle: "" });
		} catch (_err) {
			toast.error("Failed to delete auction");
		}
	};

	const stats = {
		total: auctions.length,
		active: auctions.filter((a) => a.status === "ACTIVE").length,
		pending: auctions.filter((a) => a.status === "PENDING").length,
	};

	return (
		<div className="space-y-6 pb-14">
			<PageHeader
				title="Auctions Management"
				subtitle="Monitor and manage your active bidding sessions"
				badge="Auctioneer"
				actions={
					<Button
						onClick={() => navigate({ to: "/dashboard/auctions/new" })}
						className="h-11 rounded-none px-6 text-[10px] font-heading font-bold uppercase tracking-wider w-full sm:w-auto"
					>
						<RiAddLine size={18} className="mr-2" />
						Create Auction
					</Button>
				}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
				<StatCard
					label="Total Auctions"
					value={stats.total}
					icon={RiAuctionLine}
					bgColor="bg-primary/5"
					color="text-primary"
				/>
				<StatCard
					label="Active Bidding"
					value={stats.active}
					icon={RiAuctionLine}
					bgColor="bg-success/5"
					color="text-success"
				/>
				<StatCard
					label="Pending Approval"
					value={stats.pending}
					icon={RiAuctionLine}
					bgColor="bg-warning/5"
					color="text-warning"
				/>
			</div>

			<Card title="Auction Inventory" subtitle="Your listed auctions" noPadding>
				{isLoading ? (
					<div className="p-12 text-center">
						<div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
					</div>
				) : auctions.length === 0 ? (
					<Empty className="border-t border-border p-16 rounded-none">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<RiAuctionLine className="h-4 w-4 text-primary" />
							</EmptyMedia>
							<EmptyTitle className="text-xl font-display font-black uppercase">
								No auctions found
							</EmptyTitle>
							<EmptyDescription className="uppercase tracking-widest text-[10px]">
								You haven't listed any items for auction yet.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								variant="outline"
								className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary rounded-none h-11 px-8"
								onClick={() => navigate({ to: "/dashboard/auctions/new" })}
							>
								Create first auction
							</Button>
						</EmptyContent>
					</Empty>
				) : (
					<div className="border-t border-border overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border bg-muted/20 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
									<th className="px-6 py-4">Auction Title</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Duration</th>
									<th className="px-6 py-4 text-right">Delete</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{auctions.map((auction) => (
									<tr
										key={auction.id}
										className="group hover:bg-muted/30 transition-colors"
									>
										<td className="px-6 py-4">
											<p className="font-display font-black text-sm uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
												{auction.title}
											</p>
											<p className="text-[10px] font-mono font-bold text-muted-foreground/40">
												ID: {auction.id.substring(0, 8)}...
											</p>
										</td>
										<td className="px-6 py-4">
											<Badge
												variant={
													auction.status === "ACTIVE" ? "success" : "secondary"
												}
												className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-none"
											>
												{auction.status}
											</Badge>
										</td>
										<td className="px-6 py-4 text-[10px] font-mono text-muted-foreground">
											{new Date(auction.startDate).toLocaleDateString()} -{" "}
											{new Date(auction.endDate).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 text-right">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													setDeleteModal({
														isOpen: true,
														auctionId: auction.id,
														auctionTitle: auction.title,
													})
												}
												className="h-8 w-8 rounded-none hover:bg-destructive/5 hover:text-destructive"
											>
												<RiDeleteBinLine size={16} />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			<ConfirmationModal
				isOpen={deleteModal.isOpen}
				title="Delete Auction"
				message={`Delete "${deleteModal.auctionTitle}"? This cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				type="delete"
				onConfirm={handleDelete}
				onCancel={() =>
					setDeleteModal({ isOpen: false, auctionId: "", auctionTitle: "" })
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
