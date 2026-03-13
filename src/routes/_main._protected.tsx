import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { ROUTES } from "@/shared/constants/routes";
import { store } from "@/store";

export const Route = createFileRoute("/_main/_protected")({
	beforeLoad: ({ location }) => {
		const { isAuthenticated } = store.getState().auth;
		if (!isAuthenticated) {
			throw redirect({
				to: ROUTES.AUTH.SIGNIN,
				search: {
					from: location.href,
				},
			});
		}
	},
	component: Outlet,
	pendingComponent: RouteLoading,
	notFoundComponent: NotFound,
	errorComponent: RouteError,
});
