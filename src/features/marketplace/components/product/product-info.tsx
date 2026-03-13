import { RiChat3Line } from "@remixicon/react";
import { Eye, Package, ShieldCheck } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface ProductInfoProps {
	name: string;
	description?: string;
	price: number;
	unit?: string;
	priceType?: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
	stock?: number;
	views?: number;
	onInquire?: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
	name,
	description,
	price,
	unit,
	priceType = "FIXED",
	stock = 0,
	views = 0,
	onInquire,
}) => {
	return (
		<div className="space-y-6">
			{/* Title & Badges */}
			<div className="space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 border border-border/10">
						<Eye className="w-3 h-3 text-muted-foreground" />
						<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
							{views} Views
						</span>
					</div>
					{stock > 0 ? (
						<div className="flex items-center gap-1.5 bg-success/10 px-2 py-0.5 border border-success/20">
							<Package className="w-3 h-3 text-success" />
							<span className="text-[10px] font-semibold text-success uppercase tracking-[0.18em]">
								{stock} In Stock
							</span>
						</div>
					) : (
						<div className="flex items-center gap-1.5 bg-destructive/10 px-2 py-0.5 border border-destructive/20">
							<Package className="w-3 h-3 text-destructive" />
							<span className="text-[10px] font-semibold text-destructive uppercase tracking-[0.18em]">
								Out of Stock
							</span>
						</div>
					)}
					<div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 border border-primary/10">
						<ShieldCheck className="w-3 h-3 text-primary" />
						<span className="text-[10px] font-semibold text-primary uppercase tracking-[0.18em]">
							Verified
						</span>
					</div>
				</div>

				<h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-foreground tracking-tight leading-[1.05]">
					{name}
				</h1>
			</div>

			{/* Price Section - Prominent & Simple */}
			<div className="py-6 border-y border-border/40">
				<div className="flex flex-col gap-1">
					<span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
						{priceType === "NEGOTIABLE"
							? "Quotation Model"
							: "Current Listing Price"}
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl md:text-4xl font-heading font-black text-foreground">
							{priceType === "NEGOTIABLE" ? (
								"Price Negotiable"
							) : (
								<>
									{priceType === "STARTS_AT" && (
										<span className="text-xs uppercase mr-1 text-muted-foreground font-bold tracking-widest">
											From
										</span>
									)}
									RWF {price.toLocaleString()}
								</>
							)}
						</span>
						{priceType !== "NEGOTIABLE" && (
							<span className="text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em]">
								/ {unit ?? "Unit"}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-muted-foreground">
					<div className="w-6 h-px bg-border" />
					<span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
						Brief Overview
					</span>
				</div>
				<p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
					{description ||
						"High-quality industrial component optimized for enterprise performance and durability. Detailed specifications are available in the documentation below."}
				</p>
			</div>

			{/* Primary Action */}
			<div className="pt-6 pb-2 flex flex-col sm:flex-row gap-4">
				<Button
					onClick={onInquire}
					size="lg"
					className="h-14 flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 font-heading font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] py-4"
				>
					<RiChat3Line size={16} className="mr-2" />
					Send Inquiry
				</Button>
			</div>
		</div>
	);
};
