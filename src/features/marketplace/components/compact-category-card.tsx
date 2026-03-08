import { RiArrowRightLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { ROUTES } from "@/shared/constants/routes";

interface CompactCategoryCardProps {
	category: {
		id: string;
		name: string;
		productCount?: number;
		subcategories?: string[];
	};
}

export const CompactCategoryCard: React.FC<CompactCategoryCardProps> = ({
	category,
}) => {
	return (
		<Link
			to={ROUTES.PUBLIC.PRODUCTS}
			search={{ category: category.id }}
			className="group bg-card border border-border/40 hover:border-primary/40 rounded-none p-3 sm:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
		>
			<div className="absolute top-0 left-0 w-[1px] h-0 group-hover:h-full bg-primary transition-all duration-500" />

			<div className="flex items-start justify-between mb-3 sm:mb-6">
				<div className="space-y-0.5 sm:space-y-1">
					<p className="text-[7px] sm:text-[8px] font-black text-primary uppercase tracking-[0.4em] opacity-60">
						CATEGORY:
					</p>
					<h3 className="font-black text-[10px] sm:text-xs md:text-sm text-foreground uppercase tracking-widest group-hover:text-primary transition-colors leading-tight">
						{category.name}
					</h3>
				</div>
				<div className="text-[7px] sm:text-[8px] font-black text-primary bg-primary/5 border border-primary/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-none uppercase tracking-[0.2em] whitespace-nowrap">
					{category.productCount ? `${category.productCount} Items` : "Catalog"}
				</div>
			</div>

			<div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 flex-1">
				{(category.subcategories || []).slice(0, 3).map((sub, idx) => (
					<div
						key={idx}
						className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] hover:text-foreground transition-colors group/sub"
					>
						<div className="w-1 sm:w-1.5 h-1 sm:h-1.5 border border-primary/30 group-hover/sub:bg-primary group-hover/sub:border-primary transition-all flex-shrink-0" />
						{sub}
					</div>
				))}
			</div>

			<div className="mt-auto pt-3 sm:pt-4 border-t border-border/20 flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-all">
				<span className="hidden sm:inline">Browse Category</span>
				<span className="sm:hidden">Browse</span>
				<RiArrowRightLine
					size={10}
					className="group-hover:translate-x-1 transition-transform sm:size-[12px]"
				/>
			</div>
		</Link>
	);
};
