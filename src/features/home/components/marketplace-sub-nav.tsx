import {
	RiFireLine,
	RiLayoutGridLine,
	RiLineChartLine,
	RiSparklingLine,
	RiStarLine,
	RiTrophyLine,
} from "@remixicon/react";
import { useLocation } from "@tanstack/react-router";
import type React from "react";

const anchorItems = [
	{ label: "Hot Deals", href: "#hot-deals", icon: RiFireLine },
	{ label: "Trending", href: "#trending", icon: RiLineChartLine },
	{ label: "Best Sellers", href: "#best-sellers", icon: RiTrophyLine },
	{ label: "New Arrivals", href: "#new-arrivals", icon: RiSparklingLine },
	{ label: "Featured", href: "#featured-products", icon: RiStarLine },
];

export function MarketplaceSubNav() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";

	const scrollToSection = (
		e: React.MouseEvent<HTMLAnchorElement>,
		id: string,
	) => {
		e.preventDefault();
		const element = document.getElementById(id.replace("#", ""));
		if (element) {
			const offset = 100; // Adjusted for sticky header
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	if (!isHomePage) return null;

	return (
		<div className="border-b border-border/40 bg-background/90 supports-backdrop-filter:backdrop-blur-md sticky top-[56px] z-40 overflow-hidden shadow-sm">
			<div className="max-w-[1800px] mx-auto px-2 md:px-6">
				<div className="flex items-center gap-3 md:gap-10 h-9 md:h-11 overflow-x-auto scrollbar-hide no-scrollbar">
					<div className="flex items-center gap-1.5 text-foreground/40 shrink-0">
						<RiLayoutGridLine size={11} className="md:size-[13px]" />
						<span className="text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.2em]">
							Quick Access
						</span>
					</div>

					<div className="h-2.5 md:h-3.5 w-px bg-border/60 shrink-0" />

					{anchorItems.map((item) => (
						<a
							key={item.label}
							href={item.href}
							onClick={(e) => scrollToSection(e, item.href)}
							className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[9.5px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:text-primary transition-all whitespace-nowrap h-full relative"
						>
							<item.icon
								size={11}
								className="md:size-[13px] group-hover:scale-110 transition-transform"
							/>
							{item.label}
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
