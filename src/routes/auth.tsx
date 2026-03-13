import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { store } from "@/store";

export const Route = createFileRoute("/auth")({
	validateSearch: z.object({
		from: z.string().optional().default("/"),
	}),
	beforeLoad: () => {
		const { isAuthenticated, user } = store.getState().auth;
		if (isAuthenticated) {
			if (user?.needsOnboarding) {
				throw redirect({ to: "/onboarding" });
			}
			const isAdmin = user?.role === "admin" || user?.role === "agent";
			const isProvider = user?.role === "provider" || user?.role === "supplier";

			if (isAdmin) throw redirect({ to: "/admin" });
			if (isProvider) throw redirect({ to: "/dashboard" });
			throw redirect({ to: "/" });
		}
	},
	component: AuthLayout,
	pendingComponent: RouteLoading,
	notFoundComponent: NotFound,
	errorComponent: RouteError,
});
