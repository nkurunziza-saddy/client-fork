import { RiExternalLinkLine } from "@remixicon/react";
import { Link, Outlet } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarLayoutProps {
	sidebar: React.ReactNode;
	user?: {
		name?: string;
		role?: string;
	} | null;
	title: string;
	subtitle: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
	sidebar,
	user,
	title,
	subtitle,
}) => {
	return (
		<SidebarProvider defaultOpen={true}>
			{sidebar}
			<SidebarInset className="flex flex-col bg-background">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6 sticky top-0 bg-background z-20">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="flex-1 flex items-center justify-between">
						<h2 className="text-sm font-heading font-bold uppercase tracking-widest text-muted-foreground">
							{title} <span className="text-primary mx-2">/</span> {subtitle}
						</h2>
						<div className="flex items-center gap-4 md:gap-6">
							<Link to="/">
								<Button
									variant="ghost"
									size="sm"
									className="text-[10px] font-black uppercase tracking-widest gap-2 h-9 px-4 border border-transparent hover:border-border hidden sm:flex"
								>
									<RiExternalLinkLine size={14} />
									Public Site
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="sm:hidden h-9 w-9"
								>
									<RiExternalLinkLine size={16} />
								</Button>
							</Link>
							<div className="text-right hidden sm:block">
								<p className="text-[10px] font-bold uppercase text-foreground leading-none">
									{user?.name || "User"}
								</p>
								<p className="text-[9px] font-mono text-muted-foreground mt-1 uppercase">
									{user?.role || "Member"}
								</p>
							</div>
						</div>
					</div>
				</header>
				<main className="flex-1 overflow-auto">
					<div className="px-2 sm:px-6 lg:px-8 py-6 md:py-10">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
