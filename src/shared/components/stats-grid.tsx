import type React from "react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
	children: React.ReactNode;
	className?: string;
	columns?: 1 | 2 | 3 | 4;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
	children,
	className,
	columns = 4,
}) => {
	const columnClasses = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
	};

	return (
		<div
			className={cn(
				"grid gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8",
				columnClasses[columns],
				className,
			)}
		>
			{children}
		</div>
	);
};
