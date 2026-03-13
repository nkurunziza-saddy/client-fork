import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: React.ElementType;
	change?: string;
	bgColor?: string;
	color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
	label,
	value,
	icon: Icon,
	change,
	bgColor = "bg-primary/5",
	color = "text-primary",
}) => {
	return (
		<Card className="rounded-none border-border/40 shadow-sm overflow-hidden relative group">
			<div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-500" />
			<CardContent className="p-3 sm:p-4 md:p-6">
				<div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
					<div className={cn("p-1.5 sm:p-2 rounded-none", bgColor)}>
						<Icon
							className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5", color)}
						/>
					</div>
					{change && (
						<Badge
							variant="outline"
							className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest bg-success/5 text-success border-success/10 rounded-none px-1 md:px-2"
						>
							{change}
						</Badge>
					)}
				</div>
				<h3 className="text-muted-foreground text-[7.5px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 md:mb-1 truncate">
					{label}
				</h3>
				<p className="text-lg sm:text-xl md:text-3xl font-display font-black text-foreground tracking-tighter">
					{value}
				</p>
			</CardContent>
		</Card>
	);
};
