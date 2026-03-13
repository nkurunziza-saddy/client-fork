import { useSelector } from "react-redux";
import { SidebarLayout } from "@/shared/components/layouts/sidebar-layout";
import type { RootState } from "@/store";
import { DashboardSidebar } from "./dashboard/dashboard-sidebar";

export const DashboardLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <SidebarLayout
      sidebar={<DashboardSidebar user={user} />}
      user={user}
      title="Karibu"
      subtitle="Supplier Dashboard"
    />
  );
};
