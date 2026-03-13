import { RiAddLine } from "@remixicon/react";
import { Await, useNavigate } from "@tanstack/react-router";
import { Suspense, useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteProductMutation } from "@/services/api/products";
import { useDeleteServiceMutation } from "@/services/api/services";
import { PageHeader as AdminPageHeader } from "@/shared/components/admin/page-header";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";
import type { Company, Product, ProductCategory, Service } from "@/types";
import { CompanySetupSection } from "./company-setup-section";
import {
  DashboardListSkeleton,
  DashboardStatsSkeleton,
} from "./dashboard-skeletons";
import { InventoryStats } from "./inventory/inventory-stats";
import { InventoryTable } from "./inventory/inventory-table";

interface ProviderDashboardProps {
  initialCompany?: Company;
  deferred: Promise<{
    categories: { data: ProductCategory[] };
    products: { data: Product[]; meta: { totalPages: number } };
    services: { data: Service[]; meta: { totalPages: number } };
  }>;
}

export default function ProviderDashboard({
  initialCompany,
  deferred,
}: ProviderDashboardProps) {
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    listingId: string;
    listingName: string;
    itemType: "PRODUCT" | "SERVICE" | null;
  }>({
    isOpen: false,
    listingId: "",
    listingName: "",
    itemType: null,
  });

  const [deleteProduct, { isLoading: deletingProduct }] =
    useDeleteProductMutation();
  const [deleteService, { isLoading: deletingService }] =
    useDeleteServiceMutation();

  const deleting = deletingProduct || deletingService;

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModal.listingId || !deleteModal.itemType) return;
    try {
      if (deleteModal.itemType === "PRODUCT") {
        await deleteProduct(deleteModal.listingId).unwrap();
      } else {
        await deleteService(deleteModal.listingId).unwrap();
      }
      toast.success("Listing deleted successfully");
      setDeleteModal({
        isOpen: false,
        listingId: "",
        listingName: "",
        itemType: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete listing");
    }
  }, [
    deleteProduct,
    deleteService,
    deleteModal.listingId,
    deleteModal.itemType,
  ]);

  if (!initialCompany) {
    return <CompanySetupSection deferredCategories={deferred} />;
  }

  return (
    <div className="space-y-6 pb-14">
      <AdminPageHeader
        title={initialCompany.name}
        subtitle="Manage your marketplace listings"
        badge="Supplier Dashboard"
        actions={
          <Button
            onClick={() => navigate({ to: "/dashboard/listings/new" })}
            className="h-11 rounded-none px-6 text-[10px] font-heading font-black uppercase tracking-wider w-full sm:w-auto"
          >
            <RiAddLine size={18} className="mr-2" />
            New Listing
          </Button>
        }
      />

      <Suspense
        fallback={
          <div className="space-y-6">
            <DashboardStatsSkeleton />
            <DashboardListSkeleton />
          </div>
        }
      >
        <Await promise={deferred}>
          {({ products, services }) => {
            const prods = (products?.data ?? []).map((p) => ({
              ...p,
              itemType: "PRODUCT" as const,
            }));
            const servs = (services?.data ?? []).map((s) => ({
              ...s,
              itemType: "SERVICE" as const,
            }));
            const listings = [...prods, ...servs].sort((a, b) => {
              const dateA = new Date(a.createdAt ?? 0).getTime();
              const dateB = new Date(b.createdAt ?? 0).getTime();
              return dateB - dateA;
            });

            return (
              <>
                <InventoryStats listings={listings} />
                <InventoryTable
                  listings={listings}
                  onDeleteClick={(listing) =>
                    setDeleteModal({
                      isOpen: true,
                      listingId: listing.id,
                      listingName: listing.name,
                      itemType: listing.itemType,
                    })
                  }
                />
              </>
            );
          }}
        </Await>
      </Suspense>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Listing"
        message={`Delete "${deleteModal.listingName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            listingId: "",
            listingName: "",
            itemType: null,
          })
        }
        isLoading={deleting}
      />
    </div>
  );
}
