import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/main-layout";
import { createSeoMeta } from "@/shared/utils/seo";
import { RouteLoading } from "@/shared/components/route-loading";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
  pendingComponent: RouteLoading,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
  head: () =>
    createSeoMeta({
      title: "African Wholesale Hub",
      description:
        "Karibu - The leading B2B marketplace for African wholesale commerce. Connect with verified suppliers and retailers.",
    }),
});
