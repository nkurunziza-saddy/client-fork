import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import type React from "react";

interface MetricCardProps {
	label: string;
	value: string;
	change: string;
	trend: "up" | "down";
	icon: LucideIcon;
	color: string;
	description: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
	label,
	value,
	change,
	trend,
	icon: Icon,
	color,
	description,
}) => {
	return (
		<div className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between mb-4">
				<div
					className={`p-3 rounded-xl ${color === "primary" ? "bg-primary/10" : `bg-${color}-100`}`}
				>
					<Icon
						className={`w-6 h-6 ${color === "primary" ? "text-primary" : `text-${color}-600`}`}
					/>
				</div>
				<div
					className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
						trend === "up"
							? "text-success bg-success/10"
							: "text-destructive bg-destructive/10"
					}`}
				>
					{trend === "up" ? (
						<ArrowUp className="w-3 h-3 mr-1" />
					) : (
						<ArrowDown className="w-3 h-3 mr-1" />
					)}
					{change}
				</div>
			</div>
			<div className="text-3xl font-bold text-foreground mb-2">{value}</div>
			<div className="text-sm font-medium text-foreground mb-1">{label}</div>
			<div className="text-xs text-muted-foreground">{description}</div>
		</div>
	);
};
