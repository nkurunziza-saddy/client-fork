import { createFileRoute } from "@tanstack/react-router";
import { AuctionDetailsPage } from "@/features/auctions/components/auction-details-page";
import { auctionsApi } from "@/services/api/auctions";
import { store } from "@/store";

export const Route = createFileRoute("/_main/auctions/$auctionId")({
  component: AuctionDetailsPage,
  loader: ({ params }) => {
    store.dispatch(
      auctionsApi.endpoints.getAuctionById.initiate(params.auctionId),
    );
  },
});
