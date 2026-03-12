"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavHeaderInfo } from "@/types";

export function NavHeader({ info }: { info: NavHeaderInfo }) {
	if (!info) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shrink-0">
						{info.logoUrl ? (
							<img
								src={info.logoUrl}
								alt={info.name}
								className="size-full object-cover"
								onError={(e) => {
									e.currentTarget.src = "/image-fallback.svg";
								}}
							/>
						) : info.logo ? (
							<info.logo className="size-4" />
						) : null}
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{info.name}</span>
						<span className="truncate text-xs">{info.plan}</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
