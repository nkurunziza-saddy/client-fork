import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { useAdminTable } from "@/hooks/use-admin-table";
import {
	useDeleteServiceMutation,
	useGetServicesQuery,
} from "@/services/api/services";
import { ActionModal } from "@/shared/components/action-modal";
import { PageContainer } from "@/shared/components/page-container";
import type { ServiceRow } from "@/types";
import { getServiceColumns } from "../columns/services-columns";
import { AdminTableToolbar } from "./admin-table-toolbar";
import { Card } from "./card";
import { PageHeader } from "./page-header";

function toDateLabel(value?: string) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function AdminServicesPage() {
	const navigate = useNavigate();
	const { pagination, setPagination, page, limit } = useAdminTable();

	const { data: servicesResult, isLoading } = useGetServicesQuery({
		page,
		limit,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		serviceId: string;
		serviceName: string;
	}>({
		isOpen: false,
		serviceId: "",
		serviceName: "",
	});

	const services: ServiceRow[] = useMemo(() => {
		return (servicesResult?.data ?? []).map((service) => ({
			id: service.id,
			name: service.name,
			category: service.category?.name ?? "General",
			supplier: service.company?.name ?? "Unknown supplier",
			supplierId: service.company?.id ?? "",
			status: service.isActive ? "active" : "inactive",
			createdDate: toDateLabel(service.createdAt),
			views: Number(service.views) || 0,
		}));
	}, [servicesResult]);

	const handleDelete = useCallback(async () => {
		if (!deleteModal.serviceId) return;
		try {
			await deleteService(deleteModal.serviceId).unwrap();
			toast.success("Service deleted successfully");
			setDeleteModal({ isOpen: false, serviceId: "", serviceName: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete service");
		}
	}, [deleteModal.serviceId, deleteService]);

	const columns = useMemo(
		() =>
			getServiceColumns({
				onViewDetails: (id) =>
					navigate({
						to: "/services/$serviceId",
						params: { serviceId: id },
					} as any),
				onViewProvider: (id) =>
					navigate({
						to: "/suppliers/$supplierId",
						params: { supplierId: id },
					} as any),
				onEdit: (id) =>
					navigate({
						to: "/admin/suppliers/$supplierId/edit",
						params: { supplierId: id },
					} as any),
				onDelete: (s) =>
					setDeleteModal({
						isOpen: true,
						serviceId: s.id,
						serviceName: s.name,
					}),
			}),
		[navigate],
	);

	return (
		<PageContainer isFluid className="space-y-6">
			<PageHeader title="Services" subtitle="Manage catalog services" />

			<Card
				title="Service Directory"
				subtitle="Search and review catalog services"
				noPadding
			>
				{isLoading ? (
					<div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest animate-pulse">
						Loading services...
					</div>
				) : (
					<DataTable
						columns={columns}
						data={services}
						renderToolbar={(table) => (
							<AdminTableToolbar
								table={table}
								searchColumn="name"
								searchPlaceholder="Search services..."
								statusColumn="status"
								statusOptions={[
									{ label: "Active", value: "active" },
									{ label: "Inactive", value: "inactive" },
								]}
							/>
						)}
						manualPagination
						pageCount={servicesResult?.meta?.totalPages || 0}
						onPaginationChange={setPagination}
						state={{ pagination }}
					/>
				)}
			</Card>

			<ActionModal
				isOpen={deleteModal.isOpen}
				title="Delete Service"
				description={`Are you sure you want to delete "${deleteModal.serviceName}"? This action cannot be undone.`}
				type="delete"
				onConfirm={handleDelete}
				onCancel={() =>
					setDeleteModal({ isOpen: false, serviceId: "", serviceName: "" })
				}
				isLoading={deleting}
			/>
		</PageContainer>
	);
}
