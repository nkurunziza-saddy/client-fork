import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/shared/constants/routes";
import { store } from "@/store";
import { RouteLoading } from "@/shared/components/route-loading";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";

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
