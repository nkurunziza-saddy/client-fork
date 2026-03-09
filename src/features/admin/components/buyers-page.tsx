import {
  RiDownloadLine,
  RiEyeLine,
  RiCheckLine,
  RiUserLine,
} from "@remixicon/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useGetUsersQuery } from "@/services/api/users";
import { buyerColumns, type BuyerRow } from "../columns/buyers-columns";
import { Card } from "./card";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

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
      joinDate: formatDate((user as any).createdAt),
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
          bgColor="bg-blue-50"
          color="text-blue-600"
        />
        <StatCard
          label="Verified Email"
          value={buyers.filter((b) => b.status === "verified").length}
          icon={RiCheckLine}
          bgColor="bg-green-50"
          color="text-green-600"
        />
        <StatCard
          label="Unverified"
          value={buyers.filter((b) => b.status === "unverified").length}
          icon={RiEyeLine}
          bgColor="bg-amber-50"
          color="text-amber-600"
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
            filterColumn="name"
            filterPlaceholder="Search by name..."
            manualPagination
            pageCount={usersResult?.meta?.totalPages || 0}
            onPaginationChange={setPagination}
            state={{ pagination }}
          />
        )}
      </Card>
    </div>
  );
}
