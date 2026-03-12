import { RiChat3Line } from "@remixicon/react";
import { Eye, History, ShieldCheck } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

interface ServiceInfoProps {
	service: Service;
	onInquire: () => void;
}

export const ServiceInfo: React.FC<ServiceInfoProps> = ({
	service,
	onInquire,
}) => {
	return (
		<div className="space-y-6">
			{/* Title & Badges */}
			<div className="space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 border border-border/10">
						<Eye className="w-3 h-3 text-muted-foreground" />
						<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
							{service.views || 0} Views
						</span>
					</div>
					<div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 border border-primary/10">
						<History className="w-3 h-3 text-primary" />
						<span className="text-[9px] font-black text-primary uppercase tracking-widest">
							{service.totalRequests || 0} Requests
						</span>
					</div>
					{service.company?.isVerified && (
						<div className="flex items-center gap-1.5 bg-success/5 px-2 py-0.5 border border-success/10">
							<ShieldCheck className="w-3 h-3 text-success" />
							<span className="text-[9px] font-black text-success uppercase tracking-widest">
								Certified
							</span>
						</div>
					)}
				</div>

				<h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black uppercase text-foreground tracking-tight leading-tight">
					{service.name}
				</h1>
			</div>

			{/* Price Section - Prominent & Simple */}
			<div className="py-6 border-y border-border/40">
				<div className="flex flex-col gap-1">
					<span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
						{service.priceType === "NEGOTIABLE"
							? "Service Quotation"
							: "Active Engagement Rate"}
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl md:text-4xl font-heading font-black text-foreground">
							{service.priceType === "NEGOTIABLE" ? (
								"Price Negotiable"
							) : (
								<>
									{service.priceType === "STARTS_AT" && (
										<span className="text-xs uppercase mr-1 text-muted-foreground font-bold tracking-widest">
											From
										</span>
									)}
									RWF {Number(service.price || 0).toLocaleString()}
								</>
							)}
						</span>
						{service.priceType !== "NEGOTIABLE" && service.duration && (
							<span className="text-xs text-muted-foreground font-black uppercase tracking-widest">
								/ {service.duration}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-muted-foreground">
					<div className="w-6 h-px bg-border" />
					<span className="text-[9px] font-black uppercase tracking-[0.3em]">
						Professional Brief
					</span>
				</div>
				<p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
					{service.description ||
						"Professional industry service calibrated for enterprise requirements and reliability. Full capability details and service level agreements are outlined below."}
				</p>
			</div>

			{/* Primary Action */}
			<div className="pt-6 pb-2 flex flex-col sm:flex-row gap-4">
				<Button
					onClick={onInquire}
					size="lg"
					className="h-14 flex-1 rounded-none bg-foreground text-background hover:bg-foreground/95 transition-all duration-300 font-heading font-black uppercase tracking-[0.2em] text-[10px] shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] py-4"
				>
					<RiChat3Line size={16} className="mr-2" />
					Send Inquiry
				</Button>
			</div>
		</div>
	);
};
