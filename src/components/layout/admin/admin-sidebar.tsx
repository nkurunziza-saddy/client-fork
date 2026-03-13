import {
  RiApps2Line,
  RiAuctionLine,
  RiDashboardLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiServiceLine,
  RiSettings4Line,
  RiTeamLine,
  RiUserLine,
} from "@remixicon/react";
import type React from "react";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import { BaseSidebar } from "@/shared/components";
import { ROUTES } from "@/shared/constants/routes";
import type { NavHeaderInfo } from "@/types";

interface AdminSidebarProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
}

const defaultCompany: NavHeaderInfo = {
  name: "Karibu",
  logo: RiApps2Line,
  plan: "Enterprise",
};

const navMain = [
  {
    title: "Dashboard",
    url: ROUTES.ADMIN.INDEX,
    icon: RiDashboardLine,
    isActive: true,
  },
  {
    title: "Suppliers",
    url: ROUTES.ADMIN.SUPPLIERS.INDEX,
    icon: RiTeamLine,
  },
  {
    title: "Buyers",
    url: ROUTES.ADMIN.BUYERS,
    icon: RiUserLine,
  },
  {
    title: "Products",
    url: ROUTES.ADMIN.PRODUCTS,
    icon: RiFolderLine,
  },
  {
    title: "Categories",
    url: ROUTES.ADMIN.CATEGORIES,
    icon: RiPriceTag3Line,
  },
  {
    title: "Services",
    url: ROUTES.ADMIN.SERVICES,
    icon: RiServiceLine,
  },
  {
    title: "Auctions",
    url: ROUTES.ADMIN.AUCTIONS,
    icon: RiAuctionLine,
  },
  {
    title: "Profile Settings",
    url: ROUTES.ADMIN.PROFILE,
    icon: RiSettings4Line,
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const { data: companyData } = useGetMyCompanyQuery();

  const sidebarUser = {
    name: user?.name || "Admin",
    email: user?.email || "admin@karibu.com",
    avatar: user?.avatar || "/avatars/admin.jpg",
    role: user?.role,
  };

  const headerInfo: NavHeaderInfo = companyData
    ? {
        name: companyData.name,
        logoUrl: companyData.logoUrl,
        plan: companyData.type || "Enterprise",
      }
    : defaultCompany;

  return (
    <BaseSidebar
      headerInfo={headerInfo}
      navItems={navMain}
      user={sidebarUser}
    />
  );
};
