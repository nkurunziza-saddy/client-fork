import { createFileRoute } from "@tanstack/react-router";
import { AuctionDetailsPage } from "@/features/auctions/components/auction-details-page";
import { auctionsApi } from "@/services/api/auctions";
import { store } from "@/store";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { NotFound } from "@/shared/components/not-found";

export const Route = createFileRoute("/_main/auctions/$auctionId")({
	staleTime: 30_000,
	gcTime: 300_000,
	component: AuctionDetailsPage,
	pendingComponent: RouteLoading,
	errorComponent: RouteError,
	notFoundComponent: NotFound,
	loader: async ({ params }) => {
		const result = await store.dispatch(
			auctionsApi.endpoints.getAuctionById.initiate(params.auctionId),
		);
		if (!result.data) throw new Error("Auction not found");
		return result.data;
	},
});
