import {
	RiAddLine,
	RiDeleteBinLine,
	RiEditLine,
	RiStore2Line,
} from "@remixicon/react";
import { Await, useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useCallback, useState, Suspense } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card as AdminCard } from "@/features/admin/components/card";
import { PageHeader as AdminPageHeader } from "@/features/admin/components/page-header";
import { StatCard as AdminStatCard } from "@/features/admin/components/stat-card";
import { CompanySetupForm } from "@/features/forms/components/company-setup-form";
import { cn, getErrorFromRtkQuery } from "@/lib/utils";
import {
	useCreateCompanyMutation,
} from "@/services/api/companies";
import {
	useDeleteProductMutation,
} from "@/services/api/products";
import {
	useDeleteServiceMutation,
} from "@/services/api/services";
import { StatsGrid } from "@/shared/components";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";
import type { Company, Product, Service } from "@/types";
import { DashboardListSkeleton, DashboardStatsSkeleton } from "./dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

interface ProviderDashboardProps {
	initialCompany?: Company;
	deferred: Promise<{
		categories: any;
		products: { data: Product[], meta: any };
		services: { data: Service[], meta: any };
	}>;
}

export default function ProviderDashboard({ initialCompany, deferred }: ProviderDashboardProps) {
	const navigate = useNavigate();
	const [createCompany, { isLoading: creatingCompany, error: createError }] =
		useCreateCompanyMutation();

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

	const company = initialCompany;

	const [deleteProduct, { isLoading: deletingProduct }] =
		useDeleteProductMutation();
	const [deleteService, { isLoading: deletingService }] =
		useDeleteServiceMutation();

	const deleting = deletingProduct || deletingService;

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "PENDING">(
		"ALL",
	);
	const [typeFilter, setTypeFilter] = useState<"ALL" | "PRODUCT" | "SERVICE">(
		"ALL",
	);
	const [page, setPage] = useState(1);
	const pageSize = 10;

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

	const handleCompanySubmit = async (values: any) => {
		try {
			const payload = {
				name: values.name,
				category: values.categoryId,
				type: values.companyType,
				province: values.province,
				district: values.district,
				sector: values.sector,
				cell: values.cell,
				village: values.village,
				description: values.description,
			};

			await createCompany(payload).unwrap();
			toast.success("Company profile created successfully!");
		} catch (err) {
			console.error("Company creation failed", err);
		}
	};

	if (!company) {
		const serverError = getErrorFromRtkQuery(createError);

		return (
			<Suspense fallback={<div className="container mx-auto max-w-3xl py-12 px-4"><Skeleton className="h-[600px] w-full" /></div>}>
				<Await promise={deferred}>
					{({ categories }) => (
						<div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
							<div className="mb-10 text-center">
								<h1 className="text-2xl font-heading font-black uppercase tracking-tighter text-foreground mb-3 shadow-sm inline-block px-4 py-2 bg-primary/5 border border-primary/10">
									Setup Your Provider Account
								</h1>
								<p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
									Create your company profile to start listing products and services.
								</p>
							</div>
							<div className="bg-card border border-border/40 p-6 sm:p-10 shadow-sm relative overflow-hidden">
								<div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

								<div className="relative z-10">
									<CompanySetupForm
										onSubmit={handleCompanySubmit}
										isLoading={creatingCompany}
										categories={categories?.data}
										onSkip={() => navigate({ to: "/" })}
										serverError={serverError}
									/>
								</div>
							</div>
						</div>
					)}
				</Await>
			</Suspense>
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

			<Suspense fallback={
				<div className="space-y-6">
					<DashboardStatsSkeleton />
					<DashboardListSkeleton />
				</div>
			}>
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

						const productCount = prods.length;
						const serviceCount = servs.length;
						const activeListings = listings.filter(
							(listing: any) => listing.isActive,
						).length;

						const { filteredListings, paginatedListings, totalPages } = (() => {
							const filtered = listings.filter((l: any) => {
								const matchSearch =
									l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
									l.id.toLowerCase().includes(searchQuery.toLowerCase());
								const matchStatus =
									statusFilter === "ALL"
										? true
										: statusFilter === "LIVE"
											? l.isActive
											: !l.isActive;
								const matchType = typeFilter === "ALL" ? true : l.itemType === typeFilter;
								return matchSearch && matchStatus && matchType;
							});

							const maxPages = Math.max(1, Math.ceil(filtered.length / pageSize));
							const currentPage = Math.min(page, maxPages);
							const startIndex = (currentPage - 1) * pageSize;
							const paginated = filtered.slice(startIndex, startIndex + pageSize);

							return {
								filteredListings: filtered,
								paginatedListings: paginated,
								totalPages: maxPages,
							};
						})();

						return (
							<>
								<StatsGrid columns={4}>
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
										bgColor="bg-success/5"
										color="text-success"
									/>
									<AdminStatCard
										label="Products"
										value={productCount}
										icon={Package}
										bgColor="bg-info/5"
										color="text-info"
									/>
									<AdminStatCard
										label="Services"
										value={serviceCount}
										icon={RiStore2Line}
										bgColor="bg-primary/5"
										color="text-primary"
									/>
								</StatsGrid>

								<AdminCard title="Inventory" subtitle="Active listings" noPadding>
									{listings.length === 0 ? (
										<div className="py-20 border-t border-border">
											<Empty className="max-w-md mx-auto">
												<EmptyHeader>
													<EmptyMedia variant="icon">
														<Package className="w-4 h-4 text-primary" />
													</EmptyMedia>
													<EmptyTitle className="text-xl font-display font-black uppercase">
														No listings found
													</EmptyTitle>
													<EmptyDescription className="uppercase tracking-widest text-[10px]">
														You haven't created any listings yet. Start by adding your
														first product or service.
													</EmptyDescription>
												</EmptyHeader>
												<EmptyContent>
													<Button
														variant="outline"
														className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary rounded-none h-11 px-8"
														onClick={() => navigate({ to: "/dashboard/listings/new" })}
													>
														Create first listing
													</Button>
												</EmptyContent>
											</Empty>
										</div>
									) : (
										<div className="border-t border-border">
											{/* Filters */}
											<div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border/40 bg-muted/10">
												<Input
													placeholder="Search listings..."
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value);
														setPage(1);
													}}
													className="h-9 text-xs rounded-none border-border/40 sm:max-w-[200px]"
												/>
												<Select
													value={typeFilter}
													onValueChange={(v: any) => {
														setTypeFilter(v);
														setPage(1);
													}}
												>
													<SelectTrigger className="h-9 text-xs rounded-none border-border/40 sm:max-w-[140px]">
														<SelectValue placeholder="All Types" />
													</SelectTrigger>
													<SelectContent className="rounded-none">
														<SelectItem value="ALL">All Types</SelectItem>
														<SelectItem value="PRODUCT">Products</SelectItem>
														<SelectItem value="SERVICE">Services</SelectItem>
													</SelectContent>
												</Select>
												<Select
													value={statusFilter}
													onValueChange={(v: any) => {
														setStatusFilter(v);
														setPage(1);
													}}
												>
													<SelectTrigger className="h-9 text-xs rounded-none border-border/40 sm:max-w-[140px]">
														<SelectValue placeholder="All Status" />
													</SelectTrigger>
													<SelectContent className="rounded-none">
														<SelectItem value="ALL">All Status</SelectItem>
														<SelectItem value="LIVE">Live</SelectItem>
														<SelectItem value="PENDING">Pending</SelectItem>
													</SelectContent>
												</Select>
											</div>

											{/* mobile card view */}
											<div className="block md:hidden divide-y divide-border/40">
												{paginatedListings.length === 0 ? (
													<div className="p-12">
														<Empty className="border-none p-0 gap-2">
															<EmptyHeader>
																<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
																	No matches found
																</EmptyTitle>
															</EmptyHeader>
														</Empty>
													</div>
												) : (
													paginatedListings.map((listing: any) => (
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
																			listing.isActive ? "bg-success" : "bg-warning",
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
																	data-testid="delete-listing-button"
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
													))
												)}
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
														{paginatedListings.length === 0 ? (
															<tr>
																<td colSpan={4} className="p-12">
																	<Empty className="border-none p-0 gap-2">
																		<EmptyHeader>
																			<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
																				No matches found
																			</EmptyTitle>
																		</EmptyHeader>
																	</Empty>
																</td>
															</tr>
														) : (
															paginatedListings.map((listing: any) => (
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
																					listing.isActive ? "bg-success" : "bg-warning",
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
																				data-testid="delete-listing-button"
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
															))
														)}
													</tbody>
												</table>
											</div>

											{totalPages > 1 && (
												<div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/5">
													<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
														Showing{" "}
														{Math.min((page - 1) * pageSize + 1, filteredListings.length)}{" "}
														to {Math.min(page * pageSize, filteredListings.length)} of{" "}
														{filteredListings.length} entries
													</p>
													<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest sm:hidden">
														Page {page} of {totalPages}
													</p>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															disabled={page <= 1}
															onClick={() => setPage((p) => Math.max(1, p - 1))}
															className="h-8 rounded-none text-[9px] uppercase font-bold tracking-widest"
														>
															Previous
														</Button>
														<Button
															variant="outline"
															size="sm"
															disabled={page >= totalPages}
															onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
															className="h-8 rounded-none text-[9px] uppercase font-bold tracking-widest"
														>
															Next
														</Button>
													</div>
												</div>
											)}
										</div>
									)}
								</AdminCard>
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
