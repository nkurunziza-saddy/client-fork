import type * as React from "react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/admin/page-header";
import { Card } from "@/shared/components/admin/card";
import { cn } from "@/lib/utils";

interface ResourceManagementLayoutProps {
	// slots
	header?: React.ReactNode;
	stats?: React.ReactNode;
	toolbar?: React.ReactNode;
	content: React.ReactNode;
	modals?: React.ReactNode;

	// data
	title: string;
	subtitle?: string;
	cardTitle?: string;
	cardSubtitle?: string;
	isLoading?: boolean;
	loadingText?: string;
	className?: string;
	headerActions?: React.ReactNode;
}

export function ResourceManagementLayout({
	header,
	stats,
	toolbar,
	content,
	modals,
	title,
	subtitle,
	cardTitle,
	cardSubtitle,
	isLoading,
	loadingText = "Loading data...",
	className,
	headerActions,
}: ResourceManagementLayoutProps) {
	return (
		<PageContainer isFluid className={cn("space-y-6", className)}>
			{header || (
				<PageHeader 
					title={title} 
					subtitle={subtitle} 
					actions={headerActions}
				/>
			)}

			{stats && <div className="space-y-6">{stats}</div>}

			<Card
				title={cardTitle}
				subtitle={cardSubtitle}
				noPadding
			>
				{isLoading ? (
					<div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest animate-pulse">
						{loadingText}
					</div>
				) : (
					<div className="flex flex-col">
						{toolbar && <div className="border-b border-border/40">{toolbar}</div>}
						{content}
					</div>
				)}
			</Card>

			{modals}
		</PageContainer>
	);
}
