import { Skeleton } from "@/components/ui/skeleton";

export function DetailPageSkeleton() {
	return (
		<div className="min-h-screen bg-background space-y-0 overflow-x-hidden industrial-grain pb-24">
			{/* sticky header skeleton */}
			<div className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-[56px] z-30 py-3 md:py-4 px-3 sm:px-6 lg:px-8">
				<div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-8 w-8 rounded-none" />
						<div className="h-4 w-px bg-border/60" />
						<Skeleton className="h-4 w-48" />
					</div>
					<Skeleton className="h-6 w-20 rounded-none" />
				</div>
			</div>

			<div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 space-y-12">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					{/* image gallery skeleton */}
					<div className="lg:col-span-6 xl:col-span-5 space-y-4">
						<Skeleton className="aspect-4/5 w-full rounded-none border border-border/40" />
						<div className="grid grid-cols-5 gap-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="aspect-square w-full rounded-none" />
							))}
						</div>
					</div>

					{/* info skeleton */}
					<div className="lg:col-span-6 xl:col-span-7 space-y-8">
						<div className="space-y-4 border-b border-border/40 pb-6">
							<div className="flex gap-2 items-center">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-3 w-16" />
							</div>
							<Skeleton className="h-12 w-[80%] md:w-[60%]" />
						</div>

						<div className="bg-muted/10 p-6 border border-border/40 space-y-6">
							<div className="space-y-2">
								<Skeleton className="h-3 w-32" />
								<Skeleton className="h-10 w-48" />
							</div>
							<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-20 w-full rounded-none bg-background" />
							))}
						</div>

						<div className="space-y-6">
							<div className="space-y-3">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-24 w-full" />
							</div>
							<Skeleton className="h-32 w-full rounded-none" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function AdminPageSkeleton() {
	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-48" />
				</div>
				<Skeleton className="h-10 w-32 rounded-none" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full rounded-none" />
				))}
			</div>

			<Skeleton className="h-[400px] w-full rounded-none border border-border/40" />
		</div>
	);
}
