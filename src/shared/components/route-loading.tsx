import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const RouteLoading: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 max-w-[1800px]">
			{/* page header skeleton */}
			<div className="space-y-3">
				<Skeleton className="h-10 w-[300px] md:w-[450px]" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-px w-8" />
					<Skeleton className="h-4 w-[150px] md:w-[250px]" />
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				{/* sidebar/filters skeleton */}
				<aside className="hidden lg:block w-64 shrink-0 space-y-6">
					<div className="flex items-center justify-between pb-3 border-b border-border/50">
						<Skeleton className="h-4 w-20" />
					</div>
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={`filter-${i}`} className="space-y-2">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-9 w-full" />
							</div>
						))}
					</div>
				</aside>

				{/* content grid skeleton */}
				<div className="flex-1 space-y-6">
					<div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-border/40">
						<Skeleton className="h-10 w-full sm:max-w-md" />
						<div className="flex gap-2">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={`card-${i}`}
								className="space-y-4 border border-border/10 p-4 rounded-none"
							>
								<Skeleton className="aspect-square w-full rounded-none" />
								<div className="space-y-2">
									<Skeleton className="h-3 w-[40%]" />
									<Skeleton className="h-5 w-full" />
									<div className="flex justify-between items-center pt-2">
										<Skeleton className="h-4 w-[30%]" />
										<Skeleton className="h-8 w-20" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RouteLoading;
