import * as React from "react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DetailsPageLayoutProps {
	// slots
	mobileActions?: React.ReactNode;
	headerAction?: React.ReactNode;
	gallery?: React.ReactNode;
	info?: React.ReactNode;
	tabs?: React.ReactNode;
	sidebar?: React.ReactNode;
	bottomContent?: React.ReactNode;
	modals?: React.ReactNode;

	// data
	title: string;
	badgeText?: string;
	onBack: () => void;
	className?: string;
}

export function DetailsPageLayout({
	mobileActions,
	headerAction,
	gallery,
	info,
	tabs,
	sidebar,
	bottomContent,
	modals,
	title,
	badgeText,
	onBack,
	className,
}: DetailsPageLayoutProps) {
	return (
		<div className={cn("min-h-screen bg-background space-y-0 overflow-x-hidden industrial-grain pb-24", className)}>
			{mobileActions}

			{/* Top Navigation Header */}
			<div className="bg-background border-b border-border/40 py-3 md:py-4 px-3 sm:px-6 lg:px-8 sticky top-0 z-30">
				<div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 overflow-hidden">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={onBack}
							className="shrink-0"
						>
							<RiArrowLeftSLine className="size-4" />
						</Button>
						<div className="h-4 w-px bg-border/60 shrink-0" />
						<h1 className="font-display font-black uppercase text-xs md:text-sm tracking-widest truncate text-foreground">
							{title}
						</h1>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{headerAction}
						{badgeText && (
							<Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase hidden sm:block">
								{badgeText}
							</Badge>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
				{/* Hero Section: Gallery and Primary Info */}
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-6 xl:col-span-5">
						{gallery}
					</div>

					<div className="lg:col-span-6 xl:col-span-7">
						{info}
					</div>
				</div>

				{/* Secondary Section: Tabs and Sidebar */}
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
					<div className="lg:col-span-8 space-y-12">
						{tabs}
						{bottomContent}
					</div>

					<div className="lg:col-span-4 space-y-8">
						{sidebar}
					</div>
				</div>
			</div>

			{modals}
		</div>
	);
}
