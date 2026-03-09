import { createFileRoute } from "@tanstack/react-router";
import { AdminBuyersPage } from "@/features/admin/components/buyers-page";

export const Route = createFileRoute("/admin/buyers")({
  component: AdminBuyersPage,
});
