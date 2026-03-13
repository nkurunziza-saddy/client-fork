import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { useAdminTable } from "@/hooks/use-admin-table";
import {
	useDeleteProductMutation,
	useGetProductsQuery,
} from "@/services/api/products";
import { ActionModal } from "@/shared/components/action-modal";
import { PageContainer } from "@/shared/components/page-container";
import type { ProductRow } from "@/types";
import { getProductColumns } from "../columns/products-columns";
import { AdminTableToolbar } from "@/shared/components/admin/admin-table-toolbar";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";

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

export function AdminProductsPage() {
	const navigate = useNavigate();
	const { pagination, setPagination, page, limit } = useAdminTable();

	const { data: productsResult, isLoading } = useGetProductsQuery({
		page,
		limit,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		productId: string;
		productName: string;
	}>({
		isOpen: false,
		productId: "",
		productName: "",
	});

	const products: ProductRow[] = useMemo(() => {
		return (productsResult?.data ?? []).map((product) => ({
			id: product.id,
			name: product.name,
			category: product.category?.name ?? "Uncategorized",
			supplier: product.company?.name ?? "Unknown supplier",
			supplierId: product.company?.id ?? "",
			status: product.isActive ? "active" : "inactive",
			createdDate: toDateLabel(product.createdAt),
			views: Number(product.views) || 0,
		}));
	}, [productsResult]);

	const handleDelete = useCallback(async () => {
		if (!deleteModal.productId) return;
		try {
			await deleteProduct(deleteModal.productId).unwrap();
			toast.success("Product deleted successfully");
			setDeleteModal({ isOpen: false, productId: "", productName: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete product");
		}
	}, [deleteModal.productId, deleteProduct]);

	const columns = useMemo(
		() =>
			getProductColumns({
				onViewSupplier: (id) =>
					navigate({
						to: "/suppliers/$supplierId",
						params: { supplierId: id },
					} as any),
				onViewDetails: (id) =>
					navigate({
						to: "/products/$productId",
						params: { productId: id },
					} as any),
				onEdit: (supplierId, productId) =>
					navigate({
						to: `/admin/suppliers/${supplierId}/product/${productId}/edit` as any,
					}),
				onDelete: (p) =>
					setDeleteModal({
						isOpen: true,
						productId: p.id,
						productName: p.name,
					}),
			}),
		[navigate],
	);

	return (
		<PageContainer isFluid className="space-y-6">
			<PageHeader title="Products" subtitle="Manage catalog materials" />

			<Card
				title="Product Catalog"
				subtitle="Search and review product listings"
				noPadding
			>
				{isLoading ? (
					<div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest animate-pulse">
						Loading products...
					</div>
				) : (
					<DataTable
						columns={columns}
						data={products}
						renderToolbar={(table) => (
							<AdminTableToolbar
								table={table}
								searchColumn="name"
								searchPlaceholder="Search products..."
								statusColumn="status"
								statusOptions={[
									{ label: "Active", value: "active" },
									{ label: "Inactive", value: "inactive" },
								]}
							/>
						)}
						manualPagination
						pageCount={productsResult?.meta?.totalPages || 0}
						onPaginationChange={setPagination}
						state={{ pagination }}
					/>
				)}
			</Card>

			<ActionModal
				isOpen={deleteModal.isOpen}
				title="Delete Product"
				description={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
				type="delete"
				onConfirm={handleDelete}
				onCancel={() =>
					setDeleteModal({ isOpen: false, productId: "", productName: "" })
				}
				isLoading={deleting}
			/>
		</PageContainer>
	);
}
