import { useSelector } from "react-redux";
import { SidebarLayout } from "@/shared/components/layouts/sidebar-layout";
import type { RootState } from "@/store";
import { AdminSidebar } from "./admin/admin-sidebar";

export const AdminLayout = () => {
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<SidebarLayout
			sidebar={<AdminSidebar user={user} />}
			user={user}
			title="Karibu"
			subtitle="Admin Control"
		/>
	);
};
