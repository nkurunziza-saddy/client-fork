import { getRouteApi } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { Company, Product, Service, ProductCategory } from "@/types";
import ProviderDashboard from "./provider-dashboard";
import UserDashboard from "./user-dashboard";

const routeApi = getRouteApi("/dashboard/");

export function DashboardSwitcher() {
  const { user } = useSelector((state: RootState) => state.auth);
  const data = routeApi.useLoaderData() as {
    company: Company;
    deferred: Promise<{
      categories: { data: ProductCategory[] };
      products: { data: Product[]; meta: { totalPages: number } };
      services: { data: Service[]; meta: { totalPages: number } };
    }>;
  };
  const isProvider = user?.role === "provider";

  if (isProvider) {
    return (
      <ProviderDashboard
        initialCompany={data.company}
        deferred={data.deferred as never}
      />
    );
  }

  return <UserDashboard deferred={data.deferred as never} />;
}
