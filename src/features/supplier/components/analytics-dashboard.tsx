import {
	Activity,
	Calendar,
	Eye,
	MessageCircle,
	Star,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useGetProviderStatsQuery } from "@/services/api/stats";
import { CategoryPerformanceCard } from "./analytics/category-performance-card";
import { RecentActivitiesCard, TopProductsCard } from "./analytics/list-cards";
import { MetricCard } from "./analytics/metric-card";
import { PerformanceSummaryCard } from "./analytics/performance-summary-card";
import { PerformanceTrendsCard } from "./analytics/performance-trends-card";

const AnalyticsDashboard: React.FC = () => {
	const [timeRange, setTimeRange] = useState("30d");
	const [activeChart, setActiveChart] = useState<
		"inquiries" | "views" | "conversion"
	>("views");

	const { data: providerStats, isLoading } = useGetProviderStatsQuery();

	const stats = useMemo(() => {
		if (!providerStats) return [];

		const overview = providerStats.overview;

		return [
			{
				label: "Total Views",
				value: overview.totalViews.toLocaleString(),
				change: "Live",
				trend: "up" as const,
				icon: Eye,
				color: "blue",
				description: "Profile and items views",
			},
			{
				label: "Interactions",
				value: overview.totalInteractions.toLocaleString(),
				change: "Live",
				trend: "up" as const,
				icon: MessageCircle,
				color: "green",
				description: "Customer calls, messages, and shares",
			},
			{
				label: "Active Suppliers",
				value: overview.companiesCount.toString(),
				change: "Live",
				trend: "up" as const,
				icon: TrendingUp,
				color: "primary",
				description: "Total verified supplier accounts",
			},
			{
				label: "Trust Score",
				value: overview.averageRating.toFixed(1),
				change: overview.totalReviews.toString(),
				trend: "up" as const,
				icon: Star,
				color: "purple",
				description: "Average rating from reviews",
			},
		];
	}, [providerStats]);

	// Use real data for Top Products if available in ProviderStats
	const topProducts = useMemo(() => {
		if (!providerStats || !providerStats.companies) return [];

		return providerStats.companies
			.map((company) => ({
				name: company.name,
				views: company.interactions.views,
				inquiries:
					company.interactions.whatsappClicks + company.interactions.callClicks,
				conversionRate: company.overview.rating,
				revenue: company.overview.visits, // using visits as proxy if revenue not in API
				image: "/logo.svg",
			}))
			.slice(0, 4);
	}, [providerStats]);

	const chartDataMap = {
		inquiries: [
			{ month: "Jan", value: 0, secondary: 0 },
			{ month: "Feb", value: 0, secondary: 0 },
			{ month: "Mar", value: 0, secondary: 0 },
			{ month: "Apr", value: 0, secondary: 0 },
			{ month: "May", value: 0, secondary: 0 },
			{ month: "Jun", value: 0, secondary: 0 },
		],
		views: [
			{ month: "Jan", value: 0, secondary: 0 },
			{ month: "Feb", value: 0, secondary: 0 },
			{ month: "Mar", value: 0, secondary: 0 },
			{ month: "Apr", value: 0, secondary: 0 },
			{ month: "May", value: 0, secondary: 0 },
			{ month: "Jun", value: 0, secondary: 0 },
		],
		conversion: [
			{ month: "Jan", value: 0, secondary: 0 },
			{ month: "Feb", value: 0, secondary: 0 },
			{ month: "Mar", value: 0, secondary: 0 },
			{ month: "Apr", value: 0, secondary: 0 },
			{ month: "May", value: 0, secondary: 0 },
			{ month: "Jun", value: 0, secondary: 0 },
		],
	};

	const categoryPerformance = [
		{
			category: "Construction Materials",
			percentage: 100,
			value: providerStats?.overview.totalViews || 0,
			color: "bg-primary",
			textColor: "text-primary",
		},
	];

	const recentActivities = [
		{
			type: "system",
			message: "Supplier analytics active and monitoring live activity.",
			time: "Real-time",
			icon: Activity,
			color: "text-primary bg-primary/10",
		},
	];

	const currentChartData = useMemo(
		() => chartDataMap[activeChart],
		[activeChart],
	);

	const maxValue = useMemo(
		() =>
			Math.max(...currentChartData.map((d) => Math.max(d.value, d.secondary))),
		[currentChartData],
	);

	const chartLabels = useMemo(() => {
		switch (activeChart) {
			case "inquiries":
				return { primary: "Inquiries", secondary: "Responses" };
			case "views":
				return { primary: "Profile Views", secondary: "Product Views" };
			case "conversion":
				return { primary: "Conversion Rate", secondary: "Industry Average" };
			default:
				return { primary: "Primary", secondary: "Secondary" };
		}
	}, [activeChart]);

	if (isLoading) {
		return (
			<div className="space-y-8 animate-pulse">
				<div className="h-12 w-64 bg-muted rounded-xl" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="h-32 bg-muted rounded-2xl" />
					))}
				</div>
				<div className="h-96 bg-muted rounded-2xl" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h2 className="text-3xl font-display font-black uppercase text-foreground tracking-tight leading-tight">
						Analytics Dashboard
					</h2>
					<p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
						Direct performance stats and business info
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<select
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
						className="px-4 py-2 border border-border/40 rounded-none focus:ring-1 focus:ring-primary outline-none bg-background text-[10px] font-black uppercase tracking-widest"
					>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
						<option value="90d">Last 90 days</option>
						<option value="1y">Last year</option>
					</select>
					<div className="flex items-center bg-muted/20 border border-border/40 p-2 rounded-none">
						<Calendar className="w-4 h-4 text-primary" />
					</div>
				</div>
			</div>

			{/* Key Metrics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat) => (
					<MetricCard key={stat.label} {...stat} />
				))}
			</div>

			{/* Charts Section */}
			<div className="grid lg:grid-cols-3 gap-8">
				<PerformanceTrendsCard
					activeChart={activeChart}
					onActiveChartChange={setActiveChart}
					chartData={currentChartData}
					maxValue={maxValue > 0 ? maxValue : 100}
					labels={chartLabels}
				/>
				<CategoryPerformanceCard categories={categoryPerformance} />
			</div>

			{/* Secondary Metrics */}
			<div className="grid lg:grid-cols-2 gap-8">
				<TopProductsCard products={topProducts} />
				<RecentActivitiesCard activities={recentActivities} />
			</div>

			{/* Performance Summary */}
			<PerformanceSummaryCard />
		</div>
	);
};

export default AnalyticsDashboard;
