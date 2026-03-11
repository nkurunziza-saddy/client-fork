import type React from "react";

interface CategoryPerformanceCardProps {
	categories: any[];
}

export const CategoryPerformanceCard: React.FC<
	CategoryPerformanceCardProps
> = ({ categories }) => {
	return (
		<div className="bg-card rounded-none border border-border/40 p-6 shadow-sm">
			<h3 className="text-xl font-display font-black uppercase tracking-tight text-foreground mb-6">
				Category Performance
			</h3>

			<div className="relative w-48 h-48 mx-auto mb-6">
				<svg
					className="w-full h-full transform -rotate-90"
					viewBox="0 0 100 100"
				>
					{categories.map((category, index) => {
						const startAngle = categories
							.slice(0, index)
							.reduce((sum, cat) => sum + cat.percentage * 3.6, 0);
						const endAngle = startAngle + category.percentage * 3.6;
						const largeArcFlag = category.percentage > 50 ? 1 : 0;

						const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
						const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
						const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
						const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

						const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

						return (
							<path
								key={category.category}
								d={pathData}
								className="hover:opacity-80 transition-opacity cursor-pointer"
								style={{
									fill:
										category.color === "bg-info"
											? "var(--color-chart-1)"
											: category.color === "bg-success"
												? "var(--color-chart-2)"
												: category.color === "bg-warning" ||
														category.color === "bg-primary"
													? "var(--color-chart-3)"
													: "var(--color-chart-4)",
								}}
							/>
						);
					})}
					<circle cx="50" cy="50" r="20" className="fill-card" />
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center">
						<div className="text-lg font-black text-foreground tracking-tighter">
							100%
						</div>
						<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Total
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				{categories.map((category) => (
					<div
						key={category.category}
						className="flex items-center justify-between"
					>
						<div className="flex items-center">
							<div
								className="w-3 h-3 rounded-none mr-3"
								style={{
									backgroundColor:
										category.color === "bg-info"
											? "var(--color-chart-1)"
											: category.color === "bg-success"
												? "var(--color-chart-2)"
												: category.color === "bg-warning" ||
														category.color === "bg-primary"
													? "var(--color-chart-3)"
													: "var(--color-chart-4)",
								}}
							/>
							<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
								{category.category}
							</span>
						</div>
						<div className="text-right">
							<div className="text-sm font-black text-foreground tracking-tight">
								{category.percentage}%
							</div>
							<div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
								{category.value} inquiries
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
