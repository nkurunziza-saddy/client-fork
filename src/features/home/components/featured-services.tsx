import { RiBriefcaseLine, RiMapPinLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useGetServicesQuery } from "@/services/api/services";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import { HomeSection } from "./home-section";
import { SectionHeader } from "./section-header";

const FeaturedServices: React.FC = () => {
	const navigate = useNavigate();
	const { data: servicesResult, isLoading } = useGetServicesQuery({
		isFeatured: true,
		limit: 8,
	});
	const listings = servicesResult?.data || [];

	if (!isLoading && listings.length === 0) return null;

	return (
		<HomeSection
			id="services"
			variant="muted"
			withGrid
			borderBottom
			className="py-10 lg:py-16"
		>
			<div className="max-w-[1600px] mx-auto px-4 lg:px-6">
				<SectionHeader
					title="Services & Rentals"
					subtitle="Professional services available from verified providers."
					label="Expert Services"
					icon={<RiBriefcaseLine className="w-5 h-5" />}
					viewAllHref="/services"
					viewAllLabel="View All Services"
				/>

				{isLoading || listings.length === 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="aspect-video rounded-none border border-border/20 bg-muted/10 animate-pulse"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{listings.map((service) => {
							const img = service.images?.[0];
							const price = service.price || 0;
							const company = service.company;
							return (
								<div
									key={service.id}
									className="group border border-border/40 hover:border-primary/40 transition-all duration-500 rounded-none overflow-hidden bg-card cursor-pointer flex flex-col relative"
									onClick={() =>
										navigate({ to: `/services/${service.id}` as any })
									}
								>
									{/* Technical Corner Accent */}
									<div className="absolute top-0 right-0 w-6 h-6 pointer-events-none z-20">
										<div className="absolute top-0 right-0 w-full h-[1px] bg-border/40" />
										<div className="absolute top-0 right-0 w-[1px] h-full bg-border/40" />
									</div>

									<div className="relative aspect-video overflow-hidden bg-muted/20 border-b border-border/20">
										{img ? (
											<ImageWithFallback
												src={img}
												alt={service.name}
												className="w-full h-full object-cover transition-all duration-700  group-hover:scale-110"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-20">
												No Image
											</div>
										)}
										<div className="absolute top-0 left-0 bg-primary text-white px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] shadow-2xl">
											{service.category?.name || "Service"}
										</div>
									</div>

									<div className="p-4 sm:p-6 flex flex-col flex-1">
										{company?.district && (
											<div className="flex items-center gap-1.5 sm:gap-2 text-[7px] sm:text-[8px] font-black text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">
												<RiMapPinLine className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
												{company.district}
											</div>
										)}
										<h3 className="text-xs sm:text-sm font-display font-black text-foreground mb-4 sm:mb-6 line-clamp-2 uppercase tracking-widest leading-relaxed group-hover:text-primary transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
											{service.name}
										</h3>

										<div className="mt-auto pt-4 sm:pt-6 border-t border-border/10 flex flex-col gap-1">
											<span className="text-muted-foreground/40 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.4em]">
												Starting Price
											</span>
											<div className="flex items-baseline gap-1.5 sm:gap-2">
												<span className="text-base sm:text-lg font-black text-foreground tracking-tighter">
													RWF {price.toLocaleString()}
												</span>
												{service.discount && service.discount > 0 && (
													<span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-widest">
														-{service.discount}%
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Bottom ID line */}
									<div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
								</div>
							);
						})}
					</div>
				)}

				<div className="mt-12 flex justify-center md:hidden">
					<Button
						variant="outline"
						size="lg"
						className="rounded-none h-14 px-10 font-black uppercase tracking-[0.3em] text-[10px] border-border/40 shadow-none"
						onClick={() =>
							navigate({
								to: "/services",
								search: { type: "SERVICE" } as any,
							})
						}
					>
						View All Services
					</Button>
				</div>
			</div>
		</HomeSection>
	);
};

export default FeaturedServices;
