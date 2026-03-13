import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { useAdminTable } from "@/hooks/use-admin-table";
import {
	useGetAuctionsQuery,
	useUpdateAuctionStatusMutation,
} from "@/services/api/auctions";
import { ActionModal } from "@/shared/components/action-modal";
import { AdminTableToolbar } from "@/shared/components/admin/admin-table-toolbar";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { PageContainer } from "@/shared/components/page-container";
import type { Auction, AuctionStatus } from "@/types";
import { getAuctionColumns } from "../columns/auctions-columns";

export function AdminAuctionsPage() {
	const navigate = useNavigate();
	const { pagination, setPagination, page, limit } = useAdminTable();

	const { data: auctionsResult, isLoading } = useGetAuctionsQuery({
		page,
		limit,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const [updateStatus, { isLoading: updating }] =
		useUpdateAuctionStatusMutation();

	const [statusModal, setStatusModal] = useState<{
		isOpen: boolean;
		auction: Auction | null;
		action: "APPROVE" | "REJECT" | null;
	}>({
		isOpen: false,
		auction: null,
		action: null,
	});

	const auctions = useMemo(() => {
		return auctionsResult?.data ?? [];
	}, [auctionsResult]);

	const handleStatusUpdate = useCallback(async () => {
		if (!statusModal.auction || !statusModal.action) return;

		const newStatus: AuctionStatus =
			statusModal.action === "APPROVE" ? "APPROVED" : "REJECTED";

		try {
			await updateStatus({
				id: statusModal.auction.id,
				status: newStatus,
			}).unwrap();
			toast.success(`Auction ${newStatus.toLowerCase()} successfully`);
			setStatusModal({ isOpen: false, auction: null, action: null });
		} catch (error) {
			console.error(error);
			toast.error(`Failed to ${statusModal.action.toLowerCase()} auction`);
		}
	}, [statusModal, updateStatus]);

	const columns = useMemo(
		() =>
			getAuctionColumns({
				onViewSupplier: (id) =>
					navigate({
						to: "/admin/suppliers/$supplierId",
						params: { supplierId: id },
					}),
				onApprove: (auction) =>
					setStatusModal({
						isOpen: true,
						auction,
						action: "APPROVE",
					}),
				onReject: (auction) =>
					setStatusModal({
						isOpen: true,
						auction,
						action: "REJECT",
					}),
			}),
		[navigate],
	);

	return (
		<PageContainer isFluid className="space-y-6">
			<PageHeader
				title="Auctions"
				subtitle="Review and moderate supplier auctions"
			/>

			<Card
				title="Auction Pipeline"
				subtitle="Track review status for auctions"
				noPadding
			>
				{isLoading ? (
					<div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest animate-pulse">
						Loading auctions...
					</div>
				) : (
					<DataTable
						columns={columns}
						data={auctions}
						manualPagination
						pageCount={auctionsResult?.meta?.totalPages || 0}
						onPaginationChange={setPagination}
						state={{ pagination }}
					>
						<DataTable.Toolbar>
							<AdminTableToolbar
								searchColumn="title"
								searchPlaceholder="Search auctions..."
								statusColumn="status"
								statusOptions={[
									{ label: "Pending", value: "PENDING" },
									{ label: "Approved", value: "APPROVED" },
									{ label: "Rejected", value: "REJECTED" },
								]}
							/>
						</DataTable.Toolbar>
						<DataTable.Content />
						<DataTable.Pagination />
					</DataTable>
				)}
			</Card>

			<ActionModal
				isOpen={statusModal.isOpen}
				title={`${statusModal.action === "APPROVE" ? "Approve" : "Reject"} Auction`}
				description={`Are you sure you want to ${statusModal.action?.toLowerCase()} "${statusModal.auction?.title}"?`}
				type={statusModal.action === "REJECT" ? "delete" : "success"}
				onConfirm={handleStatusUpdate}
				onCancel={() =>
					setStatusModal({ isOpen: false, auction: null, action: null })
				}
				isLoading={updating}
			/>
		</PageContainer>
	);
}
