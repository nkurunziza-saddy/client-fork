import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} className="h-32 w-full rounded-none" />
			))}
		</div>
	);
}

export function DashboardListSkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-3">
				<Skeleton className="h-10 w-full sm:max-w-[200px]" />
				<Skeleton className="h-10 w-full sm:max-w-[140px]" />
				<Skeleton className="h-10 w-full sm:max-w-[140px]" />
			</div>
			<div className="border border-border/40 divide-y divide-border/40">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="p-6 space-y-3">
						<div className="flex justify-between items-start">
							<div className="space-y-2">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-5 w-48" />
							</div>
							<Skeleton className="h-4 w-20" />
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function UserDashboardSkeleton() {
	return (
		<div className="space-y-12">
			{/* stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 border border-border/40">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-40 w-full rounded-none bg-background" />
				))}
			</div>

			<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
				<div className="lg:col-span-8 space-y-6">
					<Skeleton className="h-8 w-48" />
					<div className="space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-32 w-full rounded-none" />
						))}
					</div>
				</div>
				<div className="lg:col-span-4 space-y-6">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-64 w-full rounded-none" />
				</div>
			</div>
		</div>
	);
}
