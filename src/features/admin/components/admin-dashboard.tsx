import {
	RiAlertLine,
	RiApps2Line,
	RiFolder2Line,
	RiShieldCheckLine,
	RiUserLine,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetProductsQuery } from "@/services/api/products";
import { useGetServicesQuery } from "@/services/api/services";
import { useGetMarketplaceStatsQuery } from "@/services/api/stats";
import { PageContainer, StatsGrid } from "@/shared/components";
import { ROUTES } from "@/shared/constants/routes";
import { formatDate } from "@/shared/utils/format";
import { Card } from "./card";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

function compact(value: number) {
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return `${value}`;
}

export function AdminDashboard() {
	const navigate = useNavigate();
	const { data: stats } = useGetMarketplaceStatsQuery();
	const { data: companiesResult } = useGetCompaniesQuery({
		limit: 100,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});
	const { data: productsResult } = useGetProductsQuery({
		limit: 100,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});
	const { data: servicesResult } = useGetServicesQuery({
		limit: 100,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const companies = companiesResult?.data ?? [];
	const products = productsResult?.data ?? [];
	const services = servicesResult?.data ?? [];

	const verifiedSuppliers =
		Number(stats?.verifiedSuppliers) ||
		companies.filter((company) => company.isVerified).length;
	const activeProducts = products.filter((p) => p.isActive).length;
	const activeServices = services.filter((s) => s.isActive).length;
	const activeListings = activeProducts + activeServices;
	const catalogItems = products.length + services.length;
	const pendingReviewCount =
		companies.filter((company) => !company.isVerified).length +
		products.filter((p) => !p.isActive).length +
		services.filter((s) => !s.isActive).length;

	const recentActivity = useMemo(() => {
		const recentCompanies = companies.slice(0, 3).map((company) => ({
			id: company.id,
			type: "Supplier",
			name: company.name,
			status: company.isVerified ? "Verified" : "Pending verification",
			date: company.createdAt,
		}));

		const recentProducts = products.slice(0, 3).map((p) => ({
			id: p.id,
			type: "Product",
			name: p.name,
			status: p.isActive ? "Active" : "Inactive",
			date: p.createdAt,
		}));

		const recentServices = services.slice(0, 3).map((s) => ({
			id: s.id,
			type: "Service",
			name: s.name,
			status: s.isActive ? "Active" : "Inactive",
			date: s.createdAt,
		}));

		return [...recentCompanies, ...recentProducts, ...recentServices]
			.sort(
				(a, b) =>
					new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
			)
			.slice(0, 6);
	}, [companies, products, services]);

	return (
		<PageContainer>
			<PageHeader
				title="Admin Panel"
				subtitle="Admin dashboard"
				badge="System Administrator"
			/>

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

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
							<RiUserLine className="mr-3 h-4 w-4" /> Manage Suppliers
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
							onClick={() => navigate({ to: ROUTES.ADMIN.PRODUCTS })}
						>
							<RiFolder2Line className="mr-3 h-4 w-4" /> Manage Products
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
							onClick={() => navigate({ to: ROUTES.ADMIN.SERVICES })}
						>
							<RiApps2Line className="mr-3 h-4 w-4" /> Review Services
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start rounded-none uppercase text-[10px] font-black tracking-widest h-11 border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
							onClick={() => navigate({ to: ROUTES.ADMIN.CATEGORIES })}
						>
							<RiShieldCheckLine className="mr-3 h-4 w-4" /> System Categories
						</Button>
					</div>
				</Card>

				<Card
					title="Network Activity"
					subtitle="Recent activity"
					className="xl:col-span-2"
					noPadding
				>
					{recentActivity.length === 0 ? (
						<div className="py-12 px-6">
							<Empty className="border-none bg-transparent p-0 gap-2">
								<EmptyHeader>
									<EmptyMedia variant="icon" className="mb-0">
										<RiAlertLine className="w-4 h-4 text-muted-foreground/40" />
									</EmptyMedia>
									<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
										No activity yet
									</EmptyTitle>
								</EmptyHeader>
							</Empty>
						</div>
					) : (
						<div className="divide-y divide-border/40">
							{recentActivity.map((item) => (
								<div
									key={`${item.type}-${item.id}`}
									className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group cursor-pointer"
								>
									<div className="flex flex-col gap-0.5">
										<div className="flex items-center gap-2">
											<span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">
												{item.type}
											</span>
											<span className="w-1 h-1 bg-border rounded-full" />
											<span className="text-[9px] font-mono font-bold text-muted-foreground/40">
												{item.id.substring(0, 8)}
											</span>
										</div>
										<p className="font-display font-black text-sm uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
											{item.name}
										</p>
									</div>
									<div className="text-right">
										<p className="text-[10px] font-black text-foreground uppercase tracking-widest">
											{item.status}
										</p>
										<p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
											{formatDate(item.date)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</PageContainer>
	);
}
