import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/shared/constants";
import { ROUTES } from "@/shared/constants/routes";
import { store } from "@/store";

const PROVIDER_ROLES = [ROLES.PROVIDER, ROLES.ADMIN, ROLES.AGENT] as string[];

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () => {
		const { isAuthenticated, user } = store.getState().auth;

		if (isAuthenticated && (!user || !user.role)) {
			store.dispatch({ type: "auth/logout" });
			throw redirect({ to: ROUTES.AUTH.SIGNIN });
		}

		if (!isAuthenticated) {
			throw redirect({
				to: ROUTES.AUTH.SIGNIN,
			});
		}
		if (!user?.role || !PROVIDER_ROLES.includes(user.role)) {
			throw redirect({
				to: ROUTES.HOME,
			});
		}
	},
	preload: false,
	component: DashboardLayout,
	head: () => ({
		meta: [
			{ title: "Supplier Dashboard | AfrikaMarket" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});
