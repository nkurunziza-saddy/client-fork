import {
	RiCheckLine,
	RiDownloadLine,
	RiEyeLine,
	RiUserLine,
} from "@remixicon/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useGetUsersQuery } from "@/services/api/users";
import { type BuyerRow, buyerColumns } from "../columns/buyers-columns";
import { AdminTableToolbar } from "@/shared/components/admin/admin-table-toolbar";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { StatCard } from "@/shared/components/admin/stat-card";
import { formatDate } from "@/shared/utils/format";

export function AdminBuyersPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data: usersResult, isLoading } = useGetUsersQuery({
		page: pagination.pageIndex + 1,
		limit: pagination.pageSize,
	});

	const buyers: BuyerRow[] = useMemo(() => {
		return (usersResult?.data ?? []).map((user) => ({
			id: user.id,
			name: user.name || "-",
			email: user.email,
			role: user.role,
			phone: user.phoneNumber || "-",
			joinDate: formatDate(user.createdAt),
			status: user.emailVerified ? "verified" : "unverified",
		}));
	}, [usersResult]);

	return (
		<div className="space-y-5 pb-10">
			<PageHeader
				title="Buyers"
				subtitle="Registered buyer accounts on the platform"
				actions={
					<Button
						variant="outline"
						className="h-11 rounded-sm border border-border px-6 text-xs font-heading font-bold uppercase tracking-wider"
					>
						<RiDownloadLine size={16} className="mr-2" /> Export
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<StatCard
					label="Total Buyers"
					value={buyers.length}
					icon={RiUserLine}
					bgColor="bg-info/5"
					color="text-info"
				/>
				<StatCard
					label="Verified Email"
					value={buyers.filter((b) => b.status === "verified").length}
					icon={RiCheckLine}
					bgColor="bg-success/5"
					color="text-success"
				/>
				<StatCard
					label="Unverified"
					value={buyers.filter((b) => b.status === "unverified").length}
					icon={RiEyeLine}
					bgColor="bg-warning/5"
					color="text-warning"
				/>
			</div>

			<Card noPadding className="p-4">
				{isLoading ? (
					<div className="p-8 text-sm text-muted-foreground">
						Loading buyers...
					</div>
				) : (
					<DataTable
						columns={buyerColumns}
						data={buyers}
						manualPagination
						pageCount={usersResult?.meta?.totalPages || 0}
						onPaginationChange={setPagination}
						state={{ pagination }}
					>
						<DataTable.Toolbar>
							<AdminTableToolbar
								searchColumn="name"
								searchPlaceholder="Search by name..."
								statusColumn="status"
								statusOptions={[
									{ label: "Verified", value: "verified" },
									{ label: "Unverified", value: "unverified" },
								]}
							/>
						</DataTable.Toolbar>
						<DataTable.Content />
						<DataTable.Pagination />
					</DataTable>
				)}
			</Card>
		</div>
	);
}
