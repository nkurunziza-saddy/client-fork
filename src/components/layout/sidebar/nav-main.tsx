import {
	type RemixiconComponentType,
	RiArrowRightSLine,
} from "@remixicon/react";
import { Link, useLocation } from "@tanstack/react-router";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: RemixiconComponentType;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// Dashboard/Home links should only be active on exact match
					const isItemActive =
						item.url === "/admin" ||
						item.url === "/dashboard" ||
						item.url === "/"
							? location.pathname === item.url
							: location.pathname === item.url ||
								location.pathname.startsWith(`${item.url}/`);

					if (!item.items?.length) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									isActive={isItemActive}
									className={cn(isItemActive && "text-primary font-bold")}
									render={<Link to={item.url} preload="intent" />}
								>
									{item.icon && (
										<item.icon className={cn(isItemActive && "text-primary")} />
									)}
									<span className={cn(isItemActive && "text-primary")}>
										{item.title}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					const isSubItemActive = item.items.some(
						(sub) => location.pathname === sub.url,
					);
					const isExpanded = item.isActive || isItemActive || isSubItemActive;

					return (
						<Collapsible
							key={item.title}
							render={<SidebarMenuItem />}
							defaultOpen={isExpanded}
							className="group/collapsible"
						>
							<CollapsibleTrigger
								render={
									<SidebarMenuButton
										tooltip={item.title}
										isActive={isItemActive || isSubItemActive}
										className={cn(
											(isItemActive || isSubItemActive) &&
												"text-primary font-bold",
										)}
									>
										{item.icon && (
											<item.icon
												className={cn(
													(isItemActive || isSubItemActive) && "text-primary",
												)}
											/>
										)}
										<span
											className={cn(
												(isItemActive || isSubItemActive) && "text-primary",
											)}
										>
											{item.title}
										</span>
										<RiArrowRightSLine className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								}
							/>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items.map((subItem) => {
										const isCurrentSubActive =
											location.pathname === subItem.url;
										return (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													isActive={isCurrentSubActive}
													className={cn(
														isCurrentSubActive && "text-primary font-bold",
													)}
													render={<Link to={subItem.url} preload="intent" />}
												>
													<span>{subItem.title}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										);
									})}
								</SidebarMenuSub>
							</CollapsibleContent>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
