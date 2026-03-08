import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionsGrid } from "@/features/auctions/components/auctions-grid";
import { auctionsApi } from "@/services/api/auctions";
import { store } from "@/store";

export const Route = createFileRoute("/_main/auctions")({
	component: AuctionsPage,
	loader: () => {
		store.dispatch(
			auctionsApi.endpoints.getAuctions.initiate({
				limit: 50,
				status: "APPROVED",
			}),
		);
	},
});

function AuctionsPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="bg-background border-b border-border sticky top-0 z-30 py-4 md:py-5">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6">
					<div className="flex flex-row items-center justify-between gap-4">
						<div className="space-y-0.5">
							<h1 className="text-xl md:text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none">
								Auctions
							</h1>
							<div className="flex items-center gap-2">
								<div className="h-px w-6 bg-primary" />
								<p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
									Live Bidding Events
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 md:gap-3">
							<Button
								variant="secondary"
								size="icon"
								className="rounded-none h-8 w-8 hidden sm:flex"
							>
								<LayoutGrid className="w-3.5 h-3.5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
				<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
					<AuctionsGrid />
				</div>
			</div>
		</div>
	);
}
