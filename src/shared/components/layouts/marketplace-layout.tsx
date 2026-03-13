import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface MarketplaceLayoutProps {
	// slots
	header?: React.ReactNode;
	sidebar?: React.ReactNode;
	toolbar?: React.ReactNode;
	activeFilters?: React.ReactNode;
	content: React.ReactNode;
	pagination?: React.ReactNode;
	mobileFilters?: React.ReactNode;

	// state
	showFilters: boolean;
	hasActiveFilters?: boolean;
	onToggleFilters: () => void;
	onResetFilters: () => void;
	isMobileFiltersOpen: boolean;
	setIsMobileFiltersOpen: (open: boolean) => void;

	// data
	title: string;
	subtitle?: string;
	className?: string;
}

export function MarketplaceLayout({
	header,
	sidebar,
	toolbar,
	activeFilters,
	content,
	pagination,
	mobileFilters,
	showFilters,
	hasActiveFilters,
	onResetFilters,
	isMobileFiltersOpen,
	setIsMobileFiltersOpen,
	title,
	subtitle,
	className,
	isPending,
}: MarketplaceLayoutProps & { isPending?: boolean }) {
	return (
		<div className={cn("min-h-screen bg-background relative", className)}>
			{/* Top Progress Bar for Transitions */}
			{isPending && (
				<div className="fixed top-0 left-0 right-0 h-0.5 bg-primary/20 z-[100] overflow-hidden">
					<div className="h-full bg-primary animate-progress-bar origin-left" />
				</div>
			)}

			{/* Header Section */}
			<div className="bg-background border-b border-border sticky top-[56px] z-30 py-3 md:py-5">
				<div className="max-w-[1800px] mx-auto px-2 md:px-6">
					{header || (
						<div className="flex flex-row items-center justify-between gap-4">
							<div className="space-y-0.5">
								<h1 className="text-xl md:text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none">
									{title}
								</h1>
								{subtitle && (
									<div className="hidden xs:flex items-center gap-2">
										<div className="h-px w-6 bg-primary" />
										<p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
											{subtitle}
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="max-w-[1800px] mx-auto px-1 md:px-6 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row gap-8 items-start">
					{/* Desktop Sidebar Filters */}
					{showFilters && sidebar && (
						<aside className="hidden lg:block w-64 shrink-0 sticky top-24">
							<div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50 pr-4">
								<h2 className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
									<SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
									Filters
								</h2>
								{hasActiveFilters && (
									<Button
										variant="ghost"
										size="sm"
										className="h-5 px-0 text-[8px] uppercase font-black tracking-widest text-muted-foreground/60 hover:text-destructive hover:bg-transparent"
										onClick={onResetFilters}
									>
										Reset
									</Button>
								)}
							</div>
							<div className="pr-4">
								{sidebar}
							</div>
						</aside>
					)}

					{/* Main Content Area */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-col gap-4 mb-8">
							{/* Toolbar with integrated mobile filter trigger */}
							<div className="flex items-center gap-2">
								<div className="flex-1">
									{toolbar}
								</div>
								
								{/* Mobile Filter Trigger (passed through Toolbar usually, but handled here for consistency) */}
								<div className="lg:hidden">
									<Drawer
										open={isMobileFiltersOpen}
										onOpenChange={setIsMobileFiltersOpen}
									>
										<DrawerTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="rounded-none border-border/40 h-10 font-black uppercase text-[10px] tracking-widest px-4 gap-2"
											>
												<SlidersHorizontal className="w-3.5 h-3.5" />
												Filters
												{hasActiveFilters && (
													<span className="w-1.5 h-1.5 rounded-full bg-primary" />
												)}
											</Button>
										</DrawerTrigger>
										<DrawerContent className="bg-background flex flex-col max-h-[85vh]">
											<DrawerHeader className="p-6 border-b border-border/40 shrink-0 text-left">
												<DrawerTitle className="text-[10px] font-display font-black uppercase tracking-[0.2em] flex items-center gap-2">
													<SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
													{title} Filters
												</DrawerTitle>
											</DrawerHeader>
											<div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
												{mobileFilters || sidebar}
											</div>
											{hasActiveFilters && (
												<div className="p-6 border-t border-border/40 shrink-0 bg-muted/5">
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-center h-10 text-[9px] uppercase font-black tracking-[0.2em] border border-destructive/20 text-destructive hover:bg-destructive/5"
														onClick={() => {
															onResetFilters();
															setIsMobileFiltersOpen(false);
														}}
													>
														Reset All Filters
													</Button>
												</div>
											)}
										</DrawerContent>
									</Drawer>
								</div>
							</div>

							{/* Active Filter Badges */}
							{activeFilters}
						</div>

						{/* Results Content */}
						<div className="space-y-10">
							{content}
							{pagination}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
