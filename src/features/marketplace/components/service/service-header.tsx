import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

interface ServiceHeaderProps {
	service: Service;
	isInWishlist?: boolean;
	onToggleWishlist: () => void;
	onInquire?: () => void;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({
	isInWishlist,
	onToggleWishlist,
}) => {
	return (
		<div className="justify-end hidden md:flex py-6 text-sm w-full">
			<Button
				variant="outline"
				className="font-heading uppercase tracking-wider text-xs rounded-sm border-primary/20 text-primary hover:bg-primary/5 transition-colors gap-2"
				onClick={onToggleWishlist}
			>
				{isInWishlist ? (
					<RiHeartFill className="w-4 h-4 text-primary" />
				) : (
					<RiHeartLine className="w-4 h-4" />
				)}
				{isInWishlist ? "Saved to Hub" : "Save to Hub"}
			</Button>
		</div>
	);
};

// export default ServiceHeader;
