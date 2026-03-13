import {
	RiArrowRightUpLine,
	RiEyeLine,
	RiFileTextLine,
	RiNotification3Line,
} from "@remixicon/react";
import { Package, TrendingUp } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Card as AdminCard } from "@/shared/components/admin/card";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
	onAddProduct: () => void;
}

const stats = [
	{
		label: "Active Listings",
		value: "45",
		icon: Package,
		change: "+2 this week",
		bgColor: "bg-info/10",
		iconColor: "text-info",
	},
	{
		label: "Pending Inquiries",
		value: "8",
		icon: RiNotification3Line,
		change: "3 urgent",
		bgColor: "bg-warning/10",
		iconColor: "text-warning",
	},
	{
		label: "Open Quotes",
		value: "12",
		icon: RiFileTextLine,
		change: "RWF 4.5M",
		bgColor: "bg-primary/10",
		iconColor: "text-primary",
	},
	{
		label: "Profile Views",
		value: "1.2k",
		icon: RiEyeLine,
		change: "+15% vs mo",
		bgColor: "bg-success/10",
		iconColor: "text-success",
	},
];

const recentActivities = [
	{
		type: "inquiry",
		message: "New inquiry from Kigali Modern Builders for Cement",
		time: "2 hours ago",
		status: "new",
	},
	{
		type: "quote",
		message: "Quote #Q-2024-001 accepted by Jean-Paul",
		time: "4 hours ago",
		status: "success",
	},
	{
		type: "system",
		message: "Weekly performance report is ready",
		time: "1 day ago",
		status: "info",
	},
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
	onAddProduct,
}) => (
	<div className="space-y-8 max-w-7xl mx-auto ">
		<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
			<div>
				<h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground uppercase tracking-tight mb-2">
					Overview
				</h1>
				<p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
					Your business summary
				</p>
			</div>
			<Button
				onClick={onAddProduct}
				className="rounded-sm h-12 px-6 font-heading font-bold uppercase tracking-wider shadow-none border border-primary hover:bg-primary/90"
			>
				<Package className="w-4 h-4 mr-2" />
				Add New Product
			</Button>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat) => (
				<AdminCard
					key={stat.label}
					noPadding
					className="hover:border-primary transition-colors border border-border"
				>
					<CardContent className="p-6">
						<div className="flex justify-between items-start mb-4">
							<div
								className={cn(
									"w-12 h-12 rounded-sm flex items-center justify-center border border-transparent transition-transform hover:scale-105",
									stat.bgColor,
								)}
							>
								<stat.icon className={cn("w-6 h-6", stat.iconColor)} />
							</div>
							<Badge
								variant="outline"
								className="border-border bg-muted/30 text-muted-foreground font-heading font-bold text-[9px] uppercase tracking-wider rounded-sm"
							>
								{stat.change}
							</Badge>
						</div>
						<p className="text-3xl font-heading font-bold text-foreground mb-1">
							{stat.value}
						</p>
						<p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
							{stat.label}
						</p>
					</CardContent>
				</AdminCard>
			))}
		</div>

		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<AdminCard
				title="Recent Activity"
				subtitle="Recent updates"
				headerActions={
					<Button
						variant="ghost"
						size="sm"
						className="font-bold text-[10px] uppercase border border-transparent hover:border-border"
					>
						View All
					</Button>
				}
				noPadding
				className="lg:col-span-2 border border-border"
			>
				<div className="divide-y divide-border">
					{recentActivities.map((activity) => (
						<div
							key={activity.message}
							className="p-6 flex items-start gap-4 hover:bg-muted/10 transition-colors group"
						>
							<div
								className={cn(
									"w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:scale-110",
									activity.type === "inquiry"
										? "bg-warning/10 text-warning"
										: activity.type === "quote"
											? "bg-success/10 text-success"
											: "bg-info/10 text-info",
								)}
							>
								{activity.type === "inquiry" ? (
									<RiNotification3Line className="w-5 h-5" />
								) : activity.type === "quote" ? (
									<RiFileTextLine className="w-5 h-5" />
								) : (
									<TrendingUp className="w-5 h-5" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-heading font-bold text-foreground uppercase text-sm mb-1">
									{activity.message}
								</p>
								<p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
									{activity.time}
								</p>
							</div>
							{activity.status === "new" && (
								<div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse"></div>
							)}
						</div>
					))}
				</div>
			</AdminCard>

			<AdminCard
				className="bg-foreground text-background border-none relative overflow-hidden"
				noPadding
			>
				<div className="absolute inset-0 african-pattern opacity-[0.05] invert pointer-events-none" />
				<CardContent className="p-8 relative z-10 flex flex-col h-full justify-between min-h-[320px]">
					<div>
						<div className="w-12 h-12 bg-background/10 border border-background/20 rounded-sm flex items-center justify-center mb-6 backdrop-blur-md">
							<TrendingUp className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-2xl font-heading font-bold uppercase mb-3 tracking-wide">
							Boost Your <br /> Visibility
						</h3>
						<p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 uppercase tracking-wider">
							Suppliers who respond to inquiries within 1 hour get 3x more quote
							requests.
						</p>
					</div>
					<Button className="w-full bg-background text-foreground hover:bg-muted font-heading font-bold uppercase tracking-widest h-12 rounded-sm border-none shadow-none">
						Respond Faster
						<RiArrowRightUpLine className="ml-2 w-4 h-4" />
					</Button>
				</CardContent>
			</AdminCard>
		</div>
	</div>
);
