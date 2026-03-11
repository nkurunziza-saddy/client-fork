import { RiBuilding4Line, RiMapPinLine, RiStarFill } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import { memo } from "react";
import type { Company } from "@/types";

interface SupplierCardProps {
	company: Company;
	onViewProfile?: () => void;
}

export const SupplierCard = memo(
	({ company, onViewProfile }: SupplierCardProps) => {
		return (
			<Link
				to="/suppliers/$supplierId"
				params={{ supplierId: company.id }}
				onClick={(e: React.MouseEvent) => {
					if (onViewProfile) {
						e.preventDefault();
						onViewProfile();
					}
				}}
				className="group block bg-background border border-border/40 hover:border-primary/20 transition-all duration-500 overflow-hidden rounded-none h-full"
			>
				<div className="relative h-20 sm:h-24 overflow-hidden bg-muted">
					<div className="absolute inset-0 blueprint-grid opacity-[0.05] z-10" />

					{company.logoUrl ? (
						<img
							src={company.logoUrl}
							alt={company.name}
							className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
							onError={(e) => {
								e.currentTarget.src = "/image-fallback.svg";
							}}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-muted/95">
							<RiBuilding4Line className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground/10" />
						</div>
					)}

					{company.isVerified && (
						<div className="absolute top-1.5 right-1.5 z-20">
							<div className="bg-success text-primary-foreground text-[6px] sm:text-[7px] font-black px-1.5 py-0.5 rounded-none uppercase tracking-[0.2em] shadow-xl">
								Verified
							</div>
						</div>
					)}

					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
				</div>

				<div className="p-2.5 sm:p-4 flex flex-col grow">
					<div className="flex items-center justify-between mb-2 sm:mb-3">
						<span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-1.5 py-0.5 border border-primary/10">
							{company.category?.name || "Supplier"}
						</span>
						<div className="flex items-center gap-1">
							<RiStarFill className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-warning" />
							<span className="text-[8px] sm:text-[9px] font-black">
								{company.averageRating || 5.0}
							</span>
						</div>
					</div>

					<h3 className="text-[11px] sm:text-xs font-black uppercase tracking-tight mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
						{company.name}
					</h3>

					<div className="flex flex-col gap-1 sm:gap-1.5 text-muted-foreground mb-3 sm:mb-4">
						<div className="flex items-center gap-1.5 opacity-60">
							<RiMapPinLine className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
							<span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest truncate">
								{company.district || "Kigali"}
							</span>
						</div>
						<div className="flex items-center gap-1.5 opacity-60">
							<RiBuilding4Line className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
							<span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
								{company.type?.replace("_", " ") || "Company"}
							</span>
						</div>
					</div>

					<div className="mt-auto pt-2 sm:pt-3 border-t border-border/40 flex items-center justify-between">
						<span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.25em] text-muted-foreground group-hover:text-primary transition-colors">
							View Directory
						</span>
						<div className="w-4 h-4 sm:w-5 sm:h-5 border border-border/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
							<div className="w-0.5 h-0.5 sm:w-1 sm:h-1 border-t border-r border-border group-hover:border-white transform rotate-45 -ml-0.5" />
						</div>
					</div>
				</div>
			</Link>
		);
	},
);

SupplierCard.displayName = "SupplierCard";
