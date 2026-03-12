import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ROLES } from "@/shared/constants";
import { ROUTES } from "@/shared/constants/routes";
import { store } from "@/store";

const ALLOWED_ROLES = [ROLES.ADMIN, ROLES.AGENT] as string[];

export const Route = createFileRoute("/admin")({
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
		if (!user?.role || !ALLOWED_ROLES.includes(user.role)) {
			throw redirect({
				to: ROUTES.HOME,
			});
		}
	},
	preload: false,
	component: AdminLayout,
	head: () => ({
		meta: [
			{ title: "Admin Panel | AfrikaMarket" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});
