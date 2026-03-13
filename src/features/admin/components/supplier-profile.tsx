import {
  RiAddLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMapPinLine,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/shared/components/admin/card";
import { formatDate } from "@/shared/utils/format";
import type { Company } from "@/types";

interface SupplierProfileProps {
  company: Company;
  onSuspendClick: () => void;
  onDeleteClick: () => void;
}

export function SupplierProfile({
  company,
  onSuspendClick,
  onDeleteClick,
}: SupplierProfileProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary text-xl font-heading font-bold text-primary-foreground">
            {company.name.charAt(0)}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={company.isVerified ? "success" : "warning"}
                className="uppercase text-[10px] tracking-wider"
              >
                {company.isVerified ? "Verified" : "Pending verification"}
              </Badge>
              <Badge
                variant={company.isActive ? "default" : "secondary"}
                className="uppercase text-[10px] tracking-wider"
              >
                {company.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {company.description || "No description provided."}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <RiMapPinLine size={14} />
                {[company.district, company.province]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </span>
              <span className="flex items-center gap-1">
                <RiCalendarLine size={14} />
                Joined {formatDate(company.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              /* TODO: implement product creation route */
            }}
            className="h-10 rounded-sm"
          >
            <RiAddLine size={14} className="mr-2" /> Add Product
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              /* TODO: implement service creation route */
            }}
            className="h-10 rounded-sm"
          >
            <RiAddLine size={14} className="mr-2" /> Add Service
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/admin/suppliers/$supplierId/edit",
                params: { supplierId: company.id },
              })
            }
            className="h-10 rounded-sm"
          >
            <RiEditLine size={14} className="mr-2" /> Edit
          </Button>
          <Button
            onClick={onSuspendClick}
            className="h-10 rounded-sm bg-warning text-warning-foreground hover:bg-warning/90"
          >
            Suspend
          </Button>
          <Button
            onClick={onDeleteClick}
            className="h-10 rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <RiDeleteBinLine size={14} className="mr-2" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
