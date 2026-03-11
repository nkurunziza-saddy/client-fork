import type React from "react";
import { cn } from "@/lib/utils";

interface HomeSectionProps {
	children: React.ReactNode;
	variant?: "white" | "background" | "muted" | "dark" | "red";
	withGrid?: boolean;
	borderTop?: boolean;
	borderBottom?: boolean;
	className?: string;
	containerClassName?: string;
	id?: string;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
	children,
	variant = "background",
	withGrid = false,
	borderTop = false,
	borderBottom = true,
	className,
	containerClassName,
	id,
}) => {
	const variants = {
		white: "bg-background",
		background: "bg-background",
		muted: "bg-muted/30 backdrop-blur-sm",
		dark: "bg-foreground text-background",
		red: "bg-primary/5 border-primary/10",
	};

	return (
		<section
			id={id}
			className={cn(
				"py-10 md:py-16 lg:py-20 relative overflow-hidden",
				variants[variant],
				borderTop && "border-t border-border/40",
				borderBottom && "border-b border-border/40",
				className,
			)}
		>
			{withGrid && (
				<div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none" />
			)}
			<div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none opacity-20" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none opacity-20" />
			<div
				className={cn(
					"max-w-[1800px] mx-auto px-4 sm:px-6 h-full relative z-10",
					containerClassName,
				)}
			>
				{children}
			</div>
		</section>
	);
};
