import {
	RiAddLine,
	RiBuilding2Line,
	RiCheckboxCircleLine,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAdminTable } from "@/hooks/use-admin-table";
import {
	useDeleteCompanyMutation,
	useGetCompaniesQuery,
	useUpdateCompanyMutation,
} from "@/services/api/companies";
import { ActionModal } from "@/shared/components/action-modal";
import { AdminTableToolbar } from "@/shared/components/admin/admin-table-toolbar";
import { StatCard } from "@/shared/components/admin/stat-card";
import { ResourceManagementLayout } from "@/shared/components/layouts/resource-management-layout";
import { StatsGrid } from "@/shared/components/stats-grid";
import type { SupplierRow } from "@/types";
import { getSuppliersColumns } from "../columns/suppliers-columns";

export function AdminSuppliersPage() {
	const navigate = useNavigate();
	const { pagination, setPagination, page, limit } = useAdminTable();

	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		supplierId: "",
		supplierName: "",
	});
	const [suspendModal, setSuspendModal] = useState({
		isOpen: false,
		supplierId: "",
		supplierName: "",
	});

	const { data: companiesResult, isLoading } = useGetCompaniesQuery({
		page,
		limit,
	});
	const [deleteCompany, { isLoading: deleting }] = useDeleteCompanyMutation();
	const [updateCompany, { isLoading: suspending }] = useUpdateCompanyMutation();

	const suppliers: SupplierRow[] = useMemo(() => {
		return (companiesResult?.data ?? []).map((company) => ({
			id: company.id,
			name: company.name,
			type: company.type,
			district: company.district || "N/A",
			rating: Number(company.averageRating) || 5.0,
			status: company.isActive ? "active" : "suspended",
			isVerified: company.isVerified,
		}));
	}, [companiesResult]);

	const handleConfirmDelete = async () => {
		try {
			await deleteCompany(deleteModal.supplierId).unwrap();
			toast.success("Supplier deleted successfully");
			setDeleteModal({ isOpen: false, supplierId: "", supplierName: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete supplier");
		}
	};

	const handleConfirmSuspend = async () => {
		try {
			const company = companiesResult?.data.find(
				(c) => c.id === suspendModal.supplierId,
			);
			if (!company) return;

			await updateCompany({
				id: suspendModal.supplierId,
				data: { isActive: !company.isActive },
			}).unwrap();

			toast.success(
				company.isActive ? "Supplier suspended" : "Supplier activated",
			);
			setSuspendModal({ isOpen: false, supplierId: "", supplierName: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to update supplier status");
		}
	};

	const columns = useMemo(
		() =>
			getSuppliersColumns({
				onViewDetails: (id) =>
					navigate({
						to: "/admin/suppliers/$supplierId",
						params: { supplierId: id },
					}),
				onEdit: (id) =>
					navigate({
						to: "/admin/suppliers/$supplierId/edit",
						params: { supplierId: id },
					}),
				onSuspend: (id, name) =>
					setSuspendModal({ isOpen: true, supplierId: id, supplierName: name }),
				onDelete: (id, name) =>
					setDeleteModal({ isOpen: true, supplierId: id, supplierName: name }),
			}),
		[navigate],
	);

	return (
		<ResourceManagementLayout
			title="Suppliers"
			subtitle="Manage verified supplier entities"
			headerActions={
				<Button
					className="h-11 rounded-sm px-6 font-heading font-bold uppercase text-xs tracking-wider"
					onClick={() => navigate({ to: "/admin/suppliers/new" })}
				>
					<RiAddLine className="mr-2 h-4 w-4" /> Add Supplier
				</Button>
			}
			stats={
				<StatsGrid columns={3}>
					<StatCard
						label="Total Suppliers"
						value={companiesResult?.meta?.total?.toString() || "0"}
						icon={RiBuilding2Line}
					/>
					<StatCard
						label="Active Suppliers"
						value={suppliers
							.filter((s) => s.status === "active")
							.length.toString()}
						icon={RiCheckboxCircleLine}
						change="+2 this month"
					/>
					<StatCard
						label="Verification Rate"
						value={
							suppliers.length > 0
								? `${Math.round(
										(suppliers.filter((s) => s.isVerified).length /
											suppliers.length) *
											100,
									)}%`
								: "0%"
						}
						icon={RiCheckboxCircleLine}
					/>
				</StatsGrid>
			}
			cardTitle="Supplier Directory"
			cardSubtitle="Search and manage supplier accounts"
			isLoading={isLoading}
			loadingText="Loading suppliers..."
			content={
				<DataTable
					columns={columns}
					data={suppliers}
					manualPagination
					pageCount={companiesResult?.meta?.totalPages || 0}
					onPaginationChange={setPagination}
					state={{ pagination }}
				>
					<DataTable.Toolbar>
						<AdminTableToolbar
							searchColumn="name"
							searchPlaceholder="Search suppliers..."
							statusColumn="status"
							statusOptions={[
								{ label: "Active", value: "active" },
								{ label: "Suspended", value: "suspended" },
							]}
						/>
					</DataTable.Toolbar>
					<DataTable.Content />
					<DataTable.Pagination />
				</DataTable>
			}
			modals={
				<>
					<ActionModal
						isOpen={deleteModal.isOpen}
						title="Delete Supplier"
						description={`Are you sure you want to delete "${deleteModal.supplierName}"? This action cannot be undone.`}
						type="delete"
						onConfirm={handleConfirmDelete}
						onCancel={() =>
							setDeleteModal({
								isOpen: false,
								supplierId: "",
								supplierName: "",
							})
						}
						isLoading={deleting}
					/>

					<ActionModal
						isOpen={suspendModal.isOpen}
						title={
							suppliers.find((s) => s.id === suspendModal.supplierId)
								?.status === "active"
								? "Suspend Supplier"
								: "Activate Supplier"
						}
						description={`Are you sure you want to ${suppliers.find((s) => s.id === suspendModal.supplierId)?.status === "active" ? "suspend" : "activate"} "${suspendModal.supplierName}"?`}
						type={
							suppliers.find((s) => s.id === suspendModal.supplierId)
								?.status === "active"
								? "suspend"
								: "info"
						}
						onConfirm={handleConfirmSuspend}
						onCancel={() =>
							setSuspendModal({
								isOpen: false,
								supplierId: "",
								supplierName: "",
							})
						}
						isLoading={suspending}
					/>
				</>
			}
		/>
	);
}
