import { RiMapPinLine, RiStarFill } from "@remixicon/react";
import { useRouter } from "@tanstack/react-router";
import type React from "react";
import { ResourceCard } from "@/shared/components/catalog/resource-card";
import { formatCurrency } from "@/shared/utils/format";
import type { Service } from "@/types";

interface ServiceCardProps {
	service: Service;
	viewMode?: "grid" | "list";
	onSupplierClick?: (e: React.MouseEvent) => void;
	onClick?: () => void;
	isInWishlist?: boolean;
	onToggleWishlist?: (e: React.MouseEvent) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
	service,
	viewMode = "grid",
	onSupplierClick,
	onClick,
	isInWishlist,
	onToggleWishlist,
}) => {
	const router = useRouter();

	const handleClick = () => {
		if (onClick) {
			onClick();
		} else {
			router.navigate({ to: `/services/${service.id}` });
		}
	};

	const mainImage = service.images?.[0] || "";
	const company = service.company;

	const badges = service.priceType && (
		<div className="bg-background/90 backdrop-blur-md border border-border/20 text-[9px] font-black uppercase tracking-widest px-2 py-1 shadow-2xl">
			{service.priceType.replace("_", " ")}
		</div>
	);

	const footer = (
		<div className="flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-[9px] block uppercase font-bold text-muted-foreground tracking-tighter mb-0.5 text-left">
					Rate from
				</span>
				<span className="text-xs font-black text-foreground">
					{service.price ? formatCurrency(service.price, "RWF") : "Contact"}
				</span>
			</div>
			{company && (
				<div
					className="flex items-center gap-2 group/comp cursor-pointer"
					onClick={(e) => {
						if (onSupplierClick) {
							e.stopPropagation();
							onSupplierClick(e);
						}
					}}
				>
					<div className="w-6 h-6 rounded-none border border-border/40 flex items-center justify-center group-hover/comp:bg-primary group-hover/comp:border-primary transition-all duration-500">
						<span className="text-[10px] font-bold group-hover/comp:text-primary-foreground">
							{company.name?.charAt(0)}
						</span>
					</div>
				</div>
			)}
		</div>
	);

	return (
		<ResourceCard
			id={service.id}
			name={service.name}
			image={mainImage}
			categoryName={service.category?.name || "General Service"}
			viewMode={viewMode}
			onClick={handleClick}
			isInWishlist={isInWishlist}
			onToggleWishlist={onToggleWishlist}
			badges={badges}
			footer={footer}
		>
			<div className="flex flex-col gap-2">
				{viewMode === "grid" && (
					<div className="flex items-center justify-end mb-1">
						<div className="flex items-center gap-1 opacity-60">
							<RiStarFill className="w-3 h-3 text-warning" />
							<span className="text-[10px] font-bold">
								{company?.rating || 5.0}
							</span>
						</div>
					</div>
				)}

				<div className="flex items-center gap-1.5 text-muted-foreground text-left">
					<RiMapPinLine className="w-3 h-3" />
					<span className="text-[10px] font-medium uppercase tracking-tight">
						Kigali, Rwanda
					</span>
				</div>

				{viewMode === "list" && (
					<p className="text-sm text-muted-foreground/70 line-clamp-2 mt-2 max-w-3xl leading-relaxed text-left">
						{service.description}
					</p>
				)}
			</div>
		</ResourceCard>
	);
};
