import { Eye, MessageCircle, TrendingUp } from "lucide-react";
import type React from "react";

interface PerformanceTrendsCardProps {
	activeChart: "inquiries" | "views" | "conversion";
	onActiveChartChange: (chart: "inquiries" | "views" | "conversion") => void;
	chartData: any[];
	maxValue: number;
	labels: { primary: string; secondary: string };
}

export const PerformanceTrendsCard: React.FC<PerformanceTrendsCardProps> = ({
	activeChart,
	onActiveChartChange,
	chartData,
	maxValue,
	labels,
}) => {
	return (
		<div className="lg:col-span-2 bg-background rounded-2xl border border-border p-6 shadow-sm">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<h3 className="text-xl font-semibold text-foreground">
					Performance Trends
				</h3>
				<div className="flex items-center space-x-2">
					{[
						{ id: "inquiries", label: "Inquiries", icon: MessageCircle },
						{ id: "views", label: "Views", icon: Eye },
						{ id: "conversion", label: "Conversion", icon: TrendingUp },
					].map((chart) => (
						<button
							key={chart.id}
							onClick={() => onActiveChartChange(chart.id as any)}
							className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								activeChart === chart.id
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/20"
							}`}
						>
							<chart.icon className="w-4 h-4 mr-1" />
							{chart.label}
						</button>
					))}
				</div>
			</div>

			<div className="flex items-center justify-center space-x-6 mb-6">
				<div className="flex items-center">
					<div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
					<span className="text-sm text-muted-foreground">
						{labels.primary}
					</span>
				</div>
				<div className="flex items-center">
					<div className="w-4 h-4 bg-success rounded-full mr-2"></div>
					<span className="text-sm text-muted-foreground">
						{labels.secondary}
					</span>
				</div>
			</div>

			<div className="relative">
				<div className="h-80 flex items-end justify-between space-x-4 px-4">
					{chartData.map((data) => {
						const primaryHeight = (data.value / (maxValue || 1)) * 280;
						const secondaryHeight = (data.secondary / (maxValue || 1)) * 280;

						return (
							<div
								key={data.month}
								className="flex-1 flex flex-col items-center"
							>
								<div className="w-full flex justify-center space-x-1 mb-3">
									<div className="relative group">
										<div
											className="w-8 bg-gradient-to-t from-primary to-primary/80 rounded-t-lg transition-all duration-500 hover:from-primary hover:to-primary/90"
											style={{ height: `${primaryHeight}px` }}
										/>
										<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-muted/90 text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
											{data.value}
										</div>
									</div>
									<div className="relative group">
										<div
											className="w-8 bg-gradient-to-t from-success to-success/80 rounded-t-lg transition-all duration-500 hover:from-success hover:to-success"
											style={{ height: `${secondaryHeight}px` }}
										/>
										<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-muted/90 text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
											{data.secondary}
										</div>
									</div>
								</div>
								<span className="text-sm font-medium text-muted-foreground mt-2">
									{data.month}
								</span>
							</div>
						);
					})}
				</div>

				<div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-xs text-muted-foreground -ml-8">
					<span>{maxValue}</span>
					<span>{Math.round(maxValue * 0.75)}</span>
					<span>{Math.round(maxValue * 0.5)}</span>
					<span>{Math.round(maxValue * 0.25)}</span>
					<span>0</span>
				</div>
			</div>
		</div>
	);
};
