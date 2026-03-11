import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStartAuctionChatMutation } from "@/services/api/messages";
import { ResponsiveModal } from "@/shared/components/responsive-modal";

interface PlaceBidModalProps {
	auctionId: string;
	startingPrice: number;
	isOpen: boolean;
	onClose: () => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
	auctionId,
	startingPrice,
	isOpen,
	onClose,
}) => {
	const [bidAmount, setBidAmount] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [startAuctionChat, { isLoading }] = useStartAuctionChatMutation();

	const handleSubmit = async () => {
		const amountNum = Number(bidAmount);
		if (!amountNum || amountNum <= 0) {
			toast.error("Please enter a valid bid amount");
			return;
		}

		if (amountNum < startingPrice) {
			toast.error(
				`Your bid must be at least ${startingPrice.toLocaleString()} RWF`,
			);
			return;
		}

		try {
			// Format the bid as a structured message so the supplier knows exactly what the user is offering
			const content = `[BID NOTIFICATION]\nI am placing a bid of ${amountNum.toLocaleString()} RWF on this auction.\n\nMessage: ${message || "I am very interested in this item!"}`;

			await startAuctionChat({ auctionId, content }).unwrap();
			toast.success("Bid placed successfully! The vendor has been notified.");
			onClose();
			setBidAmount("");
			setMessage("");
		} catch (error: any) {
			toast.error(
				error.data?.error?.message || "Please sign in to place a bid.",
			);
		}
	};

	return (
		<ResponsiveModal
			open={isOpen}
			onOpenChange={onClose}
			className="p-0 overflow-hidden"
		>
			<div className="flex flex-col">
				<div className="p-6 bg-white border-b border-border/10 space-y-2">
					<h2 className="font-display font-black uppercase text-2xl tracking-tighter">
						Place Your Bid
					</h2>
					<p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-80">
						Submit your offer to the vendor
					</p>
				</div>

				<div className="p-6 space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
							Bid Amount (RWF)
						</Label>
						<Input
							type="number"
							value={bidAmount}
							onChange={(e) => setBidAmount(e.target.value)}
							placeholder={`Min: ${startingPrice.toLocaleString()}`}
							className="h-12 rounded-none bg-background focus:ring-0 text-sm font-bold"
						/>
					</div>

					<div className="space-y-3">
						<Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
							Optional Message
						</Label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Add a message to the vendor..."
							className="w-full h-32 p-4 border border-border/40 rounded-none text-sm focus:ring-1 focus:ring-primary outline-none resize-none bg-background"
						/>
					</div>
				</div>

				<div className="p-6 bg-muted/20 border-t border-border/10 flex gap-3">
					<Button
						variant="outline"
						className="flex-1 rounded-none h-12 text-[10px] font-black uppercase tracking-widest"
						onClick={onClose}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						className="flex-1 rounded-none h-12 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
						onClick={handleSubmit}
						disabled={isLoading || !bidAmount}
					>
						{isLoading ? "Submitting..." : "Submit Bid"}
					</Button>
				</div>
			</div>
		</ResponsiveModal>
	);
};
