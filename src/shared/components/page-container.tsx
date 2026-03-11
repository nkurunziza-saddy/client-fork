import type React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
	children: React.ReactNode;
	className?: string;
	isFluid?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
	children,
	className,
	isFluid = false,
}) => {
	return (
		<div
			className={cn(
				"py-4 md:py-10",
				!isFluid && "container mx-auto max-w-[1800px] px-2 sm:px-6",
				className,
			)}
		>
			{children}
		</div>
	);
};
