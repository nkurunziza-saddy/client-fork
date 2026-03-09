import type React from "react";
import { NavHeader } from "@/components/layout/sidebar/nav-header";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { NavHeaderInfo, NavItem } from "@/types";

interface BaseSidebarProps {
  headerInfo: NavHeaderInfo;
  navItems: NavItem[];
  user: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };
}

export const BaseSidebar: React.FC<BaseSidebarProps> = ({
  headerInfo,
  navItems,
  user,
}) => {
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <NavHeader info={headerInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
