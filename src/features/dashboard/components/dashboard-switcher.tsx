import { useSelector } from "react-redux";
import { getRouteApi } from "@tanstack/react-router";
import type { RootState } from "@/store";
import ProviderDashboard from "./provider-dashboard";
import UserDashboard from "./user-dashboard";

const routeApi = getRouteApi("/dashboard/");

export function DashboardSwitcher() {
	const { user } = useSelector((state: RootState) => state.auth);
	const data = routeApi.useLoaderData() as any;
	const isProvider = user?.role === "provider";

	if (isProvider) {
		return (
			<ProviderDashboard
				initialCompany={data.company}
				deferred={data.deferred}
			/>
		);
	}

	return <UserDashboard deferred={data.deferred} />;
}
