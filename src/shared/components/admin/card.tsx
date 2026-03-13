import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardProps {
	title?: string;
	subtitle?: string;
	children: React.ReactNode;
	className?: string;
	headerActions?: React.ReactNode;
	noPadding?: boolean;
}

export const CardWrapper: React.FC<CardProps> = ({
	title,
	subtitle,
	children,
	className,
	headerActions,
	noPadding = false,
}) => {
	return (
		<Card className={cn("rounded-none border-border/40 shadow-sm", className)}>
			{(title || subtitle || headerActions) && (
				<CardHeader className="border-b border-border/40 bg-muted/5 py-3 md:py-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5 md:space-y-1">
							{title && (
								<CardTitle className="font-display font-extrabold text-[13px] md:text-sm uppercase tracking-tight">
									{title}
								</CardTitle>
							)}
							{subtitle && (
								<p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
									{subtitle}
								</p>
							)}
						</div>
						{headerActions}
					</div>
				</CardHeader>
			)}
			<CardContent className={cn(noPadding ? "p-0" : "p-4 md:p-6")}>
				{children}
			</CardContent>
		</Card>
	);
};

export { CardWrapper as Card };
