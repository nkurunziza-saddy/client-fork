import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PageHeaderProps } from "@/types";

export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	subtitle,
	badge,
	actions,
	showPattern = false,
	dark = false,
	className,
}) => {
	return (
		<div
			className={cn(
				"rounded-none p-4 sm:p-6 md:p-10 relative overflow-hidden border border-border/20 shadow-none transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5",
				dark ? "bg-foreground text-background" : "bg-card text-foreground",
				className,
			)}
		>
			{showPattern && (
				<div className="absolute inset-0 african-pattern pointer-events-none" />
			)}

			<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="min-w-0">
					{badge && (
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-none border border-primary/20 mb-4 md:mb-6 font-display font-extrabold tracking-[0.3em] uppercase text-[8px] md:text-[10px] px-3 py-1">
							{badge}
						</Badge>
					)}
					<h1 className="text-xl sm:text-2xl md:text-5xl font-display font-black uppercase tracking-tighter leading-[0.9] mb-3 md:mb-4 truncate md:whitespace-normal">
						{title}
					</h1>
					{subtitle && (
						<p
							className={cn(
								"text-[9px] sm:text-[10px] md:text-sm font-bold max-w-xl uppercase tracking-[0.15em] md:tracking-[0.2em] leading-relaxed",
								dark ? "text-muted-foreground/50" : "text-muted-foreground/60",
							)}
						>
							{subtitle}
						</p>
					)}
				</div>
				{actions && (
					<div className="flex flex-col sm:flex-row gap-2 md:gap-3 shrink-0 w-full md:w-auto">
						{actions}
					</div>
				)}
			</div>
		</div>
	);
};
