import {
	RiAlertLine,
	RiApps2Line,
	RiFolder2Line,
	RiShieldCheckLine,
	RiHistoryLine,
} from "@remixicon/react";
import { Await, getRouteApi, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { PageContainer, StatsGrid } from "@/shared/components";
import { ROUTES } from "@/shared/constants/routes";
import { formatDate } from "@/shared/utils/format";
import { Card } from "./card";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";
import { AdminPageSkeleton } from "@/shared/components/skeletons";

const routeApi = getRouteApi("/admin/");

function compact(value: number) {
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return `${value}`;
}

export function AdminDashboard() {
	const navigate = useNavigate();
	const { stats, deferred } = routeApi.useLoaderData();

	return (
		<PageContainer>
			<PageHeader
				title="Admin Panel"
				subtitle="Admin dashboard"
				badge="System Administrator"
			/>

			<Suspense fallback={<AdminPageSkeleton />}>
				<Await promise={deferred}>
					{({ companies, products, services }: { companies: any, products: any, services: any }) => {
						const companiesData = companies?.data ?? [];
						const productsData = products?.data ?? [];
						const servicesData = services?.data ?? [];

						const verifiedSuppliers =
							Number(stats?.verifiedSuppliers) ||
							companiesData.filter((company: any) => company.isVerified).length;
						const activeProducts = productsData.filter((p: any) => p.isActive).length;
						const activeServices = servicesData.filter((s: any) => s.isActive).length;
						const activeListings = activeProducts + activeServices;
						const catalogItems = productsData.length + servicesData.length;
						const pendingReviewCount =
							companiesData.filter((company: any) => !company.isVerified).length +
							productsData.filter((p: any) => !p.isActive).length +
							servicesData.filter((s: any) => !s.isActive).length;

						const recentActivity = [...companiesData.slice(0, 3).map((company: any) => ({
							id: company.id,
							type: "Supplier",
							name: company.name,
							status: company.isVerified ? "Verified" : "Pending verification",
							date: company.createdAt,
						})), ...productsData.slice(0, 3).map((p: any) => ({
							id: p.id,
							type: "Product",
							name: p.name,
							status: p.isActive ? "Active" : "Inactive",
							date: p.createdAt,
						})), ...servicesData.slice(0, 3).map((s: any) => ({
							id: s.id,
							type: "Service",
							name: s.name,
							status: s.isActive ? "Active" : "Inactive",
							date: s.createdAt,
						}))].sort(
							(a, b) =>
								new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
						).slice(0, 6);

						return (
							<>
								<StatsGrid columns={4}>
									<StatCard
										label="Suppliers"
										value={compact(verifiedSuppliers)}
										icon={RiShieldCheckLine}
										bgColor="bg-success/5"
										color="text-success"
									/>
									<StatCard
										label="Listings"
										value={compact(activeListings)}
										icon={RiApps2Line}
										bgColor="bg-info/5"
										color="text-info"
									/>
									<StatCard
										label="Catalog"
										value={compact(catalogItems)}
										icon={RiFolder2Line}
										bgColor="bg-info/5"
										color="text-info"
									/>
									<StatCard
										label="Review"
										value={compact(pendingReviewCount)}
										icon={RiAlertLine}
										bgColor="bg-warning/5"
										color="text-warning"
									/>
								</StatsGrid>

								<div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mt-6">
									<Card
										title="Quick Operations"
										subtitle="Manage sections"
										className="xl:col-span-1"
									>
										<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
											<Button
												variant="outline"
												className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
												onClick={() => navigate({ to: ROUTES.ADMIN.SUPPLIERS.INDEX })}
											>
												<RiShieldCheckLine className="mr-2 h-4 w-4" />
												Suppliers
											</Button>
											<Button
												variant="outline"
												className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
												onClick={() => navigate({ to: ROUTES.ADMIN.PRODUCTS })}
											>
												<RiApps2Line className="mr-2 h-4 w-4" />
												Products
											</Button>
											<Button
												variant="outline"
												className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
												onClick={() => navigate({ to: ROUTES.ADMIN.SERVICES })}
											>
												<RiFolder2Line className="mr-2 h-4 w-4" />
												Services
											</Button>
											<Button
												variant="outline"
												className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
												onClick={() => navigate({ to: ROUTES.ADMIN.CATEGORIES })}
											>
												<RiApps2Line className="mr-2 h-4 w-4" />
												Categories
											</Button>
										</div>
									</Card>

									<Card
										title="Recent Activity"
										subtitle="Latest marketplace updates"
										className="xl:col-span-2"
										noPadding
									>
										{recentActivity.length === 0 ? (
											<div className="py-12 px-6">
												<Empty className="p-0">
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<RiHistoryLine className="h-4 w-4 text-muted-foreground/40" />
														</EmptyMedia>
														<EmptyTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">
															No recent activity
														</EmptyTitle>
													</EmptyHeader>
												</Empty>
											</div>
										) : (
											<div className="divide-y divide-border/40">
												{recentActivity.map((item) => (
													<div
														key={`${item.type}-${item.id}`}
														className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors group cursor-pointer"
													>
														<div className="min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60 px-1.5 py-0.5 bg-primary/5 border border-primary/10">
																	{item.type}
																</span>
																<span className="text-[10px] font-mono text-muted-foreground/40">
																	{formatDate(item.date)}
																</span>
															</div>
															<h4 className="text-sm font-display font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
																{item.name}
															</h4>
														</div>
														<div className="text-right shrink-0">
															<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
																{item.status}
															</p>
														</div>
													</div>
												))}
											</div>
										)}
									</Card>
								</div>
							</>
						);
					}}
				</Await>
			</Suspense>
		</PageContainer>
	);
}
