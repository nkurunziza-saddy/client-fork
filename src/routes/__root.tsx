import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { NotFound } from "@/shared/components/not-found";
import { RouteLoading } from "@/shared/components/route-loading";
import { RouteError } from "@/shared/components/route-error";
import "../index.css";

export const Route = createRootRoute({
	component: RootComponent,
	pendingComponent: RouteLoading,
	notFoundComponent: NotFound,
	errorComponent: RouteError,
});

function RootComponent() {
	return (
		<>
			<NuqsAdapter>
				<HeadContent />
				<Outlet />
			</NuqsAdapter>
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
