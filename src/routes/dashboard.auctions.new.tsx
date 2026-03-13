import { createFileRoute } from "@tanstack/react-router";
import { NewAuctionPage } from "@/features/auctions/components/new-auction-page";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";

export const Route = createFileRoute("/dashboard/auctions/new")({
	component: NewAuctionPage,
	pendingComponent: RouteLoading,
	errorComponent: RouteError,
	notFoundComponent: NotFound,
});
