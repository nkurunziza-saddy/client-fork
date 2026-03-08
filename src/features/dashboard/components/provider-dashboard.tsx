import {
	RiAddLine,
	RiDeleteBinLine,
	RiEditLine,
	RiStore2Line,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card as AdminCard } from "@/features/admin/components/card";
import { PageHeader as AdminPageHeader } from "@/features/admin/components/page-header";
import { StatCard as AdminStatCard } from "@/features/admin/components/stat-card";
import { cn } from "@/lib/utils";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import {
	useDeleteProductMutation,
	useGetProductsQuery,
} from "@/services/api/products";
import {
	useDeleteServiceMutation,
	useGetServicesQuery,
} from "@/services/api/services";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";

export default function ProviderDashboard() {
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
	const { data: company, isLoading: companyLoading } = useGetMyCompanyQuery();
	const companyId = company?.id;

	const { data: productsResult, isLoading: productsLoading } =
		useGetProductsQuery(companyId ? { companyId, limit: 100 } : { limit: 0 });
	const { data: servicesResult, isLoading: servicesLoading } =
		useGetServicesQuery(companyId ? { companyId, limit: 100 } : { limit: 0 });
	const [deleteProduct, { isLoading: deletingProduct }] =
		useDeleteProductMutation();
	const [deleteService, { isLoading: deletingService }] =
		useDeleteServiceMutation();

	const deleting = deletingProduct || deletingService;
	const listLoading = productsLoading || servicesLoading;

	const listings = useMemo(() => {
		const prods = (productsResult?.data ?? []).map((p) => ({
			...p,
			itemType: "PRODUCT" as const,
		}));
		const servs = (servicesResult?.data ?? []).map((s) => ({
			...s,
			itemType: "SERVICE" as const,
		}));
		return [...prods, ...servs].sort((a, b) => {
			const dateA = new Date(a.createdAt ?? 0).getTime();
			const dateB = new Date(b.createdAt ?? 0).getTime();
			return dateB - dateA;
		});
	}, [productsResult?.data, servicesResult?.data]);

	const productCount = productsResult?.data.length ?? 0;
	const serviceCount = servicesResult?.data.length ?? 0;
	const activeListings = listings.filter(
		(listing: any) => listing.isActive,
	).length;

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

	if (companyLoading) {
		return (
			<div className="flex items-center justify-center p-24">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
			</div>
		);
	}

	if (!company) {
		return (
			<div className="mx-auto max-w-2xl py-20">
				<AdminCard className="p-12 text-center">
					<RiStore2Line className="mx-auto mb-6 h-16 w-16 text-muted-foreground/20" />
					<h1 className="mb-4 text-2xl font-heading font-bold uppercase tracking-tight text-foreground">
						No Company Assigned
					</h1>
					<p className="mb-8 text-muted-foreground">
						Your account is not linked to a company yet. Contact an
						administrator to get provider dashboard access.
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							variant="outline"
							onClick={() => navigate({ to: "/" })}
							className="h-12 rounded-sm px-8 text-xs font-heading font-bold uppercase tracking-widest"
						>
							Back to Marketplace
						</Button>
						<Button
							onClick={() =>
								(window.location.href = "mailto:support@afrikamarket.com")
							}
							className="h-12 rounded-sm px-8 text-xs font-heading font-bold uppercase tracking-widest"
						>
							Contact Support
						</Button>
					</div>
				</AdminCard>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-14">
			<AdminPageHeader
				title={company.name}
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

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
				<AdminStatCard
					label="Listings"
					value={listings.length}
					icon={Package}
					bgColor="bg-primary/5"
					color="text-primary"
				/>
				<AdminStatCard
					label="Active"
					value={activeListings}
					icon={RiStore2Line}
					bgColor="bg-emerald-50"
					color="text-emerald-600"
				/>
				<AdminStatCard
					label="Products"
					value={productCount}
					icon={Package}
					bgColor="bg-blue-50"
					color="text-blue-600"
				/>
				<AdminStatCard
					label="Services"
					value={serviceCount}
					icon={RiStore2Line}
					bgColor="bg-violet-50"
					color="text-violet-600"
				/>
			</div>

			<AdminCard title="Inventory" subtitle="Active listings" noPadding>
				{listLoading ? (
					<div className="p-12 text-center">
						<div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
					</div>
				) : listings.length === 0 ? (
					<div className="border-t border-border p-16 text-center">
						<Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
						<p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
							No listings found.
						</p>
						<Button
							variant="ghost"
							className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
							onClick={() => navigate({ to: "/dashboard/listings/new" })}
						>
							Create first listing
						</Button>
					</div>
				) : (
					<div className="border-t border-border">
						{/* mobile card view */}
						<div className="block md:hidden divide-y divide-border/40">
							{listings.map((listing: any) => (
								<div
									key={listing.id}
									className="p-4 active:bg-muted/50 transition-colors"
									onClick={() =>
										navigate({
											to: `/dashboard/listings/${listing.id}/edit`,
											search: { type: listing.itemType },
										} as any)
									}
								>
									<div className="flex justify-between items-start mb-3">
										<div>
											<p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">
												{listing.itemType}
											</p>
											<h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">
												{listing.name}
											</h4>
											<p className="text-[10px] font-mono font-bold text-muted-foreground/40 mt-0.5">
												ID: {listing.id.substring(0, 8)}...
											</p>
										</div>
										<div className="flex items-center gap-1.5">
											<div
												className={cn(
													"h-1.5 w-1.5 rounded-full",
													listing.isActive ? "bg-emerald-500" : "bg-amber-500",
												)}
											/>
											<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
												{listing.isActive ? "Live" : "Pending"}
											</span>
										</div>
									</div>
									<div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/5">
										<Button
											variant="outline"
											size="sm"
											className="h-8 text-[9px] font-black uppercase tracking-widest rounded-none border-border/40"
											onClick={(e) => {
												e.stopPropagation();
												navigate({
													to: `/dashboard/listings/${listing.id}/edit`,
													search: { type: listing.itemType },
												} as any);
											}}
										>
											<RiEditLine className="mr-1.5 h-3 w-3" /> Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="h-8 text-[9px] font-black uppercase tracking-widest rounded-none border-border/40 text-destructive hover:bg-destructive/5"
											onClick={(e) => {
												e.stopPropagation();
												setDeleteModal({
													isOpen: true,
													listingId: listing.id,
													listingName: listing.name,
													itemType: listing.itemType,
												});
											}}
										>
											<RiDeleteBinLine className="mr-1.5 h-3 w-3" /> Delete
										</Button>
									</div>
								</div>
							))}
						</div>

						{/* desktop table view */}
						<div className="hidden md:block overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/20 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
										<th className="px-6 py-4">Listing Name</th>
										<th className="px-6 py-4">Category</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{listings.map((listing: any) => (
										<tr
											key={listing.id}
											className="cursor-pointer transition-colors hover:bg-muted/30"
											onClick={() =>
												navigate({
													to: `/dashboard/listings/${listing.id}/edit`,
													search: { type: listing.itemType },
												} as any)
											}
										>
											<td className="px-6 py-4">
												<p className="font-display font-black text-sm uppercase tracking-tight text-foreground">
													{listing.name}
												</p>
												<p className="text-[10px] font-mono font-bold text-muted-foreground/40">
													{listing.id}
												</p>
											</td>
											<td className="px-6 py-4">
												<Badge
													variant="outline"
													className="text-[9px] font-black uppercase tracking-[0.2em] rounded-none border-primary/20 bg-primary/5 text-primary"
												>
													{listing.itemType}
												</Badge>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div
														className={cn(
															"h-2 w-2 rounded-full",
															listing.isActive
																? "bg-emerald-500"
																: "bg-amber-500",
														)}
													/>
													<span className="text-[10px] font-black uppercase tracking-widest text-foreground">
														{listing.isActive ? "Live" : "Inactive"}
													</span>
												</div>
											</td>
											<td
												className="px-6 py-4 text-right"
												onClick={(e) => e.stopPropagation()}
											>
												<div className="flex items-center justify-end gap-2">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 rounded-none hover:bg-primary/5 hover:text-primary"
														onClick={() =>
															navigate({
																to: `/dashboard/listings/${listing.id}/edit`,
																search: { type: listing.itemType },
															} as any)
														}
													>
														<RiEditLine className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 rounded-none hover:bg-destructive/5 hover:text-destructive"
														onClick={() =>
															setDeleteModal({
																isOpen: true,
																listingId: listing.id,
																listingName: listing.name,
																itemType: listing.itemType,
															})
														}
													>
														<RiDeleteBinLine className="h-4 w-4" />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</AdminCard>

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
