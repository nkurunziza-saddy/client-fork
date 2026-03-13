import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailsPage } from "@/features/marketplace/components/service-details-page";
import { servicesApi } from "@/services/api/services";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { store } from "@/store";

export const Route = createFileRoute("/_main/services/$serviceId")({
	staleTime: 60_000,
	gcTime: 300_000,
	component: ServiceDetailsPage,
	pendingComponent: RouteLoading,
	errorComponent: RouteError,
	notFoundComponent: NotFound,
	loader: async ({ params }) => {
		const result = await store.dispatch(
			servicesApi.endpoints.getServiceById.initiate(params.serviceId),
		);
		if (!result.data) throw new Error("Service not found");
		return result.data;
	},
});
