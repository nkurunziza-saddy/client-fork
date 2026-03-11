import {
	RiHeartFill,
	RiHeartLine,
	RiPhoneLine,
	RiShareForwardLine,
	RiWhatsappLine,
} from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { shareContent } from "@/lib/utils";
import type { Service } from "@/types";

interface MobileActionsProps {
	service: Service;
	isInWishlist: boolean;
	onToggleWishlist: () => void;
	onContactClick: () => void;
	trackAndNavigate: (
		type: "CALL_CLICK" | "EMAIL_CLICK" | "WHATSAPP_CLICK",
		href: string,
	) => void;
}

export const MobileActions: React.FC<MobileActionsProps> = ({
	service,
	isInWishlist,
	onToggleWishlist,
	onContactClick,
	trackAndNavigate,
}) => {
	const phone = service?.company?.phone ?? "";

	const handleShare = () => {
		shareContent({
			title: service.name || "Professional Service",
			text: `Check out this service: ${service.name}`,
			url: window.location.href,
		});
	};

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 py-2.5 z-50 flex flex-col gap-2 safe-area-bottom shadow-[0_-8px_30px] shadow-foreground/10">
			<div className="flex items-center gap-2 w-full">
				<div className="flex items-center gap-1.5 flex-1 overflow-hidden">
					{phone && (
						<button
							type="button"
							onClick={() => trackAndNavigate("CALL_CLICK", `tel:${phone}`)}
							className="flex-none w-11 h-11 flex items-center justify-center rounded-none bg-muted border border-border text-foreground active:bg-accent transition-colors"
						>
							<RiPhoneLine size={18} />
						</button>
					)}
					{phone && (
						<button
							type="button"
							onClick={() =>
								trackAndNavigate(
									"WHATSAPP_CLICK",
									`https://wa.me/${phone.replace(/\D/g, "")}`,
								)
							}
							className="flex-none w-11 h-11 flex items-center justify-center rounded-none bg-success text-success-foreground active:bg-success/90 transition-colors"
						>
							<RiWhatsappLine size={20} />
						</button>
					)}
					<Button
						variant="outline"
						size="icon"
						className="flex-none w-11 h-11 rounded-none border-border text-primary active:bg-primary/10 transition-colors"
						onClick={handleShare}
					>
						<RiShareForwardLine size={18} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="flex-none w-11 h-11 rounded-none border-primary/20 text-primary active:bg-primary/10 transition-colors"
						onClick={onToggleWishlist}
					>
						{isInWishlist ? (
							<RiHeartFill className="w-5 h-5 text-primary" />
						) : (
							<RiHeartLine className="w-5 h-5" />
						)}
					</Button>
				</div>
				<Button
					size="lg"
					className="flex-none font-heading font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300"
					onClick={onContactClick}
				>
					Inquire
				</Button>
			</div>
		</div>
	);
};
