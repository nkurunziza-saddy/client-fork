import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetServicesQuery } from "@/services/api/services";
import type { AssignmentRow } from "@/types";
import { getAssignmentColumns } from "../columns/assignments-columns";
import { Card } from "./card";
import { PageHeader } from "./page-header";

function formatDate(value?: string) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function AdminAssignmentsPage() {
	const navigate = useNavigate();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data: servicesResult, isLoading } = useGetServicesQuery({
		page: pagination.pageIndex + 1,
		limit: pagination.pageSize,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const assignments: AssignmentRow[] = useMemo(() => {
		return (servicesResult?.data ?? []).map((service) => ({
			id: service.id,
			supplier: service.company?.name ?? "Unknown supplier",
			supplierId: service.company?.id ?? "",
			service: service.name,
			assignedDate: formatDate(service.createdAt),
			status: service.isActive ? "active" : "inactive",
			price: Number(service.price) || 0,
		}));
	}, [servicesResult]);

	const columns = useMemo(
		() =>
			getAssignmentColumns({
				onViewSupplier: (id) => navigate({ to: `/suppliers/${id}` as any }),
				onViewService: (id) => navigate({ to: `/services/${id}` as any }),
			}),
		[navigate],
	);

	return (
		<div className="space-y-5 pb-10">
			<PageHeader
				title="Assignments"
				subtitle="Manage service-to-supplier assignments"
				badge="Recent Assignments"
			/>

			<Card>
				{isLoading ? (
					<div className="p-8 text-sm text-muted-foreground">
						Loading assignments...
					</div>
				) : (
					<DataTable
						columns={columns}
						data={assignments}
						filterColumn="service"
						filterPlaceholder="Search services..."
						manualPagination
						pageCount={servicesResult?.meta?.totalPages || 0}
						onPaginationChange={setPagination}
						state={{ pagination }}
					/>
				)}
			</Card>
		</div>
	);
}
