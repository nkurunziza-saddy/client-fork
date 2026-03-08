import { RiAddLine, RiAuctionLine, RiDeleteBinLine } from "@remixicon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/features/admin/components/card";
import { PageHeader } from "@/features/admin/components/page-header";
import { StatCard } from "@/features/admin/components/stat-card";
import {
	useDeleteAuctionMutation,
	useGetAuctionsQuery,
} from "@/services/api/auctions";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";

export const Route = createFileRoute("/dashboard/auctions/")({
	component: SupplierAuctionsPage,
});

function SupplierAuctionsPage() {
	const navigate = useNavigate();
	const { data: company } = useGetMyCompanyQuery();

	const { data: auctionsResult, isLoading } = useGetAuctionsQuery(
		company?.id ? { companyId: company.id, limit: 100 } : { limit: 0 },
		{ skip: !company?.id },
	);

	const [deleteAuction, { isLoading: isDeleting }] = useDeleteAuctionMutation();
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		auctionId: "",
		auctionTitle: "",
	});

	const auctions = auctionsResult?.data ?? [];
	const activeAuctions = auctions.filter((a) => a.status === "APPROVED").length;
	const pendingAuctions = auctions.filter((a) => a.status === "PENDING").length;

	const handleDelete = async () => {
		if (!deleteModal.auctionId) return;
		try {
			await deleteAuction(deleteModal.auctionId).unwrap();
			toast.success("Auction deleted successfully");
			setDeleteModal({ isOpen: false, auctionId: "", auctionTitle: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete auction");
		}
	};

	if (!company) {
		return null; // The layout handles company missing state
	}

	return (
		<div className="space-y-6 pb-14">
			<PageHeader
				title="My Auctions"
				subtitle="Manage your auction listings"
				badge="Supplier Dashboard"
				actions={
					<Button
						onClick={() => navigate({ to: "/dashboard/auctions/new" })}
						className="h-11 rounded-none px-6 text-[10px] font-heading font-black uppercase tracking-wider w-full sm:w-auto"
					>
						<RiAddLine size={18} className="mr-2" />
						Create Auction
					</Button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
				<StatCard
					label="Total Auctions"
					value={auctions.length}
					icon={RiAuctionLine}
					bgColor="bg-primary/5"
					color="text-primary"
				/>
				<StatCard
					label="Active/Approved"
					value={activeAuctions}
					icon={RiAuctionLine}
					bgColor="bg-emerald-50"
					color="text-emerald-600"
				/>
				<StatCard
					label="Pending"
					value={pendingAuctions}
					icon={RiAuctionLine}
					bgColor="bg-amber-50"
					color="text-amber-600"
				/>
			</div>

			<Card title="Auction Inventory" subtitle="Your listed auctions" noPadding>
				{isLoading ? (
					<div className="p-12 text-center">
						<div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
					</div>
				) : auctions.length === 0 ? (
					<div className="border-t border-border p-16 text-center">
						<RiAuctionLine className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
						<p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
							No auctions found.
						</p>
						<Button
							variant="ghost"
							className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
							onClick={() => navigate({ to: "/dashboard/auctions/new" })}
						>
							Create first auction
						</Button>
					</div>
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
										className="transition-colors hover:bg-muted/30"
									>
										<td className="px-6 py-4">
											<p className="font-display font-black text-sm uppercase tracking-tight text-foreground">
												{auction.title}
											</p>
											<p className="text-[10px] font-mono font-bold text-muted-foreground/60">
												Price: {auction.startingPrice.toLocaleString()} RWF
											</p>
										</td>
										<td className="px-6 py-4">
											<Badge
												variant={
													auction.status === "APPROVED"
														? "success"
														: auction.status === "REJECTED"
															? "destructive"
															: "secondary"
												}
												className="text-[9px] font-black uppercase tracking-[0.2em] rounded-none"
											>
												{auction.status}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<p className="text-xs text-muted-foreground">
												{new Date(auction.startDate).toLocaleDateString()}
											</p>
											<p className="text-xs text-muted-foreground">
												{new Date(auction.endDate).toLocaleDateString()}
											</p>
										</td>
										<td className="px-6 py-4 text-right">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-none hover:bg-destructive/5 hover:text-destructive text-muted-foreground"
												onClick={() =>
													setDeleteModal({
														isOpen: true,
														auctionId: auction.id,
														auctionTitle: auction.title,
													})
												}
											>
												<RiDeleteBinLine className="h-4 w-4" />
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
				message={`Delete "${deleteModal.auctionTitle}"? This action cannot be undone.`}
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
