import { RiAddLine } from "@remixicon/react";
import { AdminPageSkeleton } from "@/shared/components/skeletons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useDeleteCompanyMutation,
	useGetCompanyByIdQuery,
	useUpdateCompanyMutation,
} from "@/services/api/companies";
import { useGetProductsQuery } from "@/services/api/products";
import { useGetServicesQuery } from "@/services/api/services";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { SupplierProfile } from "./supplier-profile";
import { SupplierStats } from "./supplier-stats";
import { SupplierProductsTable } from "./supplier-products-table";
import { SupplierServicesTable } from "./supplier-services-table";

function formatDate(value?: string) {
	if (!value) return "-";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function AdminSupplierDetailsPage() {
	const { supplierId } = useParams({ from: "/admin/suppliers/$supplierId/" });
	const navigate = useNavigate();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [suspendOpen, setSuspendOpen] = useState(false);
	
	const { data: company, isLoading: loadingCompany } = useGetCompanyByIdQuery(supplierId);
	const { data: productsResult, isLoading: loadingProducts } = useGetProductsQuery({ companyId: supplierId, limit: 100 });
	const { data: servicesResult, isLoading: loadingServices } = useGetServicesQuery({ companyId: supplierId, limit: 100 });
	
	const [deleteCompany, { isLoading: deleting }] = useDeleteCompanyMutation();
	const [updateCompany, { isLoading: suspending }] = useUpdateCompanyMutation();

	const products = productsResult?.data ?? [];
	const services = servicesResult?.data ?? [];
	const loading = loadingCompany || loadingProducts || loadingServices;

	const supplierStats = useMemo(() => {
		return {
			productCount: products.length,
			serviceCount: services.length,
			memberSince: formatDate(company?.createdAt),
			visits: company?.visits ?? 0,
		};
	}, [company, products.length, services.length]);

	const handleSuspend = async () => {
		if (!company) return;
		try {
			await updateCompany({
				id: company.id,
				data: { isActive: false },
			}).unwrap();
			setSuspendOpen(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async () => {
		if (!company) return;
		try {
			await deleteCompany(company.id).unwrap();
			navigate({ to: "/admin/suppliers" });
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) {
		return <AdminPageSkeleton />;
	}

	if (!company) {
		return (
			<div className="space-y-5 pb-10">
				<PageHeader
					title="Suppliers"
					subtitle="Manage all supplier accounts"
					actions={
						<Button
							onClick={() => navigate({ to: "/admin/suppliers/new" })}
							className="h-11 rounded-sm px-6 font-heading font-bold uppercase text-xs tracking-wider"
						>
							<RiAddLine size={18} className="mr-2" />
							Add Supplier
						</Button>
					}
				/>
				<div className="space-y-4 py-20 text-center">
					<p className="text-sm text-muted-foreground">Supplier not found.</p>
					<Button onClick={() => navigate({ to: "/admin/suppliers" })}>
						Back to list
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-14">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					onClick={() => navigate({ to: "/admin/suppliers" })}
					className="group flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider text-foreground hover:bg-muted"
				>
					<ChevronLeft
						size={16}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Back to Suppliers
				</Button>
			</div>

			<SupplierProfile 
				company={company} 
				onSuspendClick={() => setSuspendOpen(true)} 
				onDeleteClick={() => setDeleteOpen(true)} 
			/>

			<SupplierStats stats={supplierStats} />

			<Card noPadding>
				<Tabs defaultValue="products" className="w-full">
					<div className="border-b border-border px-4 pt-4">
						<TabsList>
							<TabsTrigger value="products">
								Products ({products.length})
							</TabsTrigger>
							<TabsTrigger value="services">
								Services ({services.length})
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="products" className="m-0 p-4">
						<SupplierProductsTable products={products} supplierId={supplierId} />
					</TabsContent>

					<TabsContent value="services" className="m-0 p-4">
						<SupplierServicesTable services={services} />
					</TabsContent>
				</Tabs>
			</Card>

			<ConfirmationModal
				isOpen={deleteOpen}
				title="Delete Supplier"
				message={`Delete "${company.name}" and remove all related data?`}
				confirmText="Delete"
				cancelText="Cancel"
				type="delete"
				onConfirm={handleDelete}
				onCancel={() => setDeleteOpen(false)}
				isLoading={deleting}
			/>

			<ConfirmationModal
				isOpen={suspendOpen}
				title="Suspend Supplier"
				message={`Suspend "${company.name}"? The supplier account will be disabled.`}
				confirmText="Suspend"
				cancelText="Cancel"
				type="suspend"
				onConfirm={handleSuspend}
				onCancel={() => setSuspendOpen(false)}
				isLoading={suspending}
			/>
		</div>
	);
}
