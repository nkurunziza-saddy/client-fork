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
				"w-full min-w-0 mx-auto py-4 md:py-8",
				isFluid
					? "px-2 sm:px-4 md:px-6 lg:px-8"
					: "px-4 md:px-8 lg:px-12",
				className,
			)}
		>
			{children}
		</div>
	);
};
