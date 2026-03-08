import { createFileRoute } from "@tanstack/react-router";
import { AdminAuctionsPage } from "@/features/admin/components/auctions-page";

export const Route = createFileRoute("/admin/auctions")({
	component: AdminAuctionsPage,
});
