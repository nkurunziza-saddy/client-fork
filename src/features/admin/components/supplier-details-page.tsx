import {
	RiAddLine,
	RiCalendarLine,
	RiDeleteBinLine,
	RiEditLine,
	RiMapPinLine,
	RiShieldCheckLine,
	RiStore2Line,
	RiUserLine,
} from "@remixicon/react";
import { AdminPageSkeleton } from "@/shared/components/skeletons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Card } from "./card";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

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
	const { data: company, isLoading: loadingCompany } =
		useGetCompanyByIdQuery(supplierId);
	const { data: productsResult, isLoading: loadingProducts } =
		useGetProductsQuery({ companyId: supplierId, limit: 100 });
	const { data: servicesResult, isLoading: loadingServices } =
		useGetServicesQuery({ companyId: supplierId, limit: 100 });
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
							onClick={() =>
								navigate({
									to: `/admin/suppliers/${company.id}/products/new` as any,
								})
							}
							className="h-10 rounded-sm"
						>
							<RiAddLine size={14} className="mr-2" /> Add Product
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								navigate({
									to: `/admin/suppliers/${company.id}/services/new` as any,
								})
							}
							className="h-10 rounded-sm"
						>
							<RiAddLine size={14} className="mr-2" /> Add Service
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								navigate({ to: `/admin/suppliers/${company.id}/edit` as any })
							}
							className="h-10 rounded-sm"
						>
							<RiEditLine size={14} className="mr-2" /> Edit
						</Button>
						<Button
							onClick={() => setSuspendOpen(true)}
							className="h-10 rounded-sm bg-warning text-warning-foreground hover:bg-warning/90"
						>
							Suspend
						</Button>
						<Button
							onClick={() => setDeleteOpen(true)}
							className="h-10 rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							<RiDeleteBinLine size={14} className="mr-2" /> Delete
						</Button>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Products"
					value={supplierStats.productCount}
					icon={RiStore2Line}
					bgColor="bg-info/5"
					color="text-info"
				/>
				<StatCard
					label="Services"
					value={supplierStats.serviceCount}
					icon={RiUserLine}
					bgColor="bg-info/5"
					color="text-info"
				/>
				<StatCard
					label="Visits"
					value={supplierStats.visits}
					icon={RiUserLine}
					bgColor="bg-warning/5"
					color="text-warning"
				/>
				<StatCard
					label="Member Since"
					value={supplierStats.memberSince}
					icon={RiShieldCheckLine}
					bgColor="bg-success/5"
					color="text-success"
				/>
			</div>

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
						{products.length === 0 ? (
							<Empty className="py-12 border border-dashed border-border rounded-none">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<RiStore2Line className="w-4 h-4 text-primary" />
									</EmptyMedia>
									<EmptyTitle className="text-xl font-display font-black uppercase">
										No products found
									</EmptyTitle>
									<EmptyDescription className="uppercase tracking-widest text-[10px]">
										This supplier hasn't listed any products yet.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
											<th className="py-3">Name</th>
											<th className="py-3">Category</th>
											<th className="py-3">Price</th>
											<th className="py-3">Stock</th>
											<th className="py-3">Status</th>
										</tr>
									</thead>
									<tbody>
										{products.map((product) => (
											<tr
												key={product.id}
												onClick={() =>
													navigate({
														to: `/admin/suppliers/${supplierId}/product/${product.id}` as any,
													})
												}
												className="cursor-pointer border-b border-border/50 hover:bg-muted/30"
											>
												<td className="py-3 font-medium">{product.name}</td>
												<td className="py-3 text-muted-foreground">
													{product.category?.name ?? "-"}
												</td>
												<td className="py-3">
													RWF{" "}
													{(product.variants?.[0]?.price ?? 0).toLocaleString()}
												</td>
												<td className="py-3">
													{product.variants?.[0]?.stock ?? 0}
												</td>
												<td className="py-3">
													<Badge
														variant={product.isActive ? "success" : "secondary"}
														className="uppercase text-[10px] tracking-wider"
													>
														{product.isActive ? "active" : "inactive"}
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</TabsContent>

					<TabsContent value="services" className="m-0 p-4">
						{services.length === 0 ? (
							<Empty className="py-12 border border-dashed border-border rounded-none">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<RiStore2Line className="w-4 h-4 text-primary" />
									</EmptyMedia>
									<EmptyTitle className="text-xl font-display font-black uppercase">
										No services found
									</EmptyTitle>
									<EmptyDescription className="uppercase tracking-widest text-[10px]">
										This supplier hasn't listed any services yet.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
											<th className="py-3">Name</th>
											<th className="py-3">Category</th>
											<th className="py-3">Price</th>
											<th className="py-3">Status</th>
										</tr>
									</thead>
									<tbody>
										{services.map((service) => (
											<tr
												key={service.id}
												className="border-b border-border/50 hover:bg-muted/30"
											>
												<td className="py-3 font-medium">{service.name}</td>
												<td className="py-3 text-muted-foreground">
													{service.category?.name ?? "-"}
												</td>
												<td className="py-3">
													RWF {(service.price ?? 0).toLocaleString()}
												</td>
												<td className="py-3">
													<Badge
														variant={service.isActive ? "success" : "secondary"}
														className="uppercase text-[10px] tracking-wider"
													>
														{service.isActive ? "active" : "inactive"}
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
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
