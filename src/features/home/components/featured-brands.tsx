import { RiBuilding2Line } from "@remixicon/react";
import React from "react";
import { HomeSection } from "./home-section";
import { SectionHeader } from "./section-header";

const BRANDS = [
	{ name: "Caterpillar", logo: "CAT" },
	{ name: "Bosch", logo: "BOSCH" },
	{ name: "Makita", logo: "MAKITA" },
	{ name: "DeWalt", logo: "DEWALT" },
	{ name: "Hilti", logo: "HILTI" },
	{ name: "Komatsu", logo: "KOMATSU" },
];

export const FeaturedBrands: React.FC = () => {
	const sectionId = React.useId();
	return (
		<HomeSection
			id={sectionId}
			variant="background"
			borderBottom
			className="py-8 lg:py-10"
		>
			<div className="max-w-[1600px] mx-auto px-4 lg:px-6 relative z-10">
				<SectionHeader
					title="Top Brands"
					subtitle="Reliable tools and materials from world-leading construction brands."
					label="Our Partners"
					icon={<RiBuilding2Line className="w-5 h-5" />}
				/>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border/40 border border-border/40">
					{BRANDS.map((brand) => (
						<div
							key={brand.name}
							className="h-40 bg-background flex flex-col items-center justify-center group hover:bg-primary/5 transition-all duration-500 cursor-pointer rounded-none"
						>
							<span className="text-3xl font-heading font-black text-muted-foreground/30 group-hover:text-primary transition-colors tracking-tighter italic">
								{brand.logo}
							</span>
							<div className="mt-4 text-[9px] font-bold text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-500 uppercase tracking-widest translate-y-2 group-hover:translate-y-0">
								Verified Brand
							</div>
						</div>
					))}
				</div>
			</div>
		</HomeSection>
	);
};
