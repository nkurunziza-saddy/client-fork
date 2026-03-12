import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ProductCard } from "@/features/marketplace/components/catalog/product-card";
import type { Product } from "@/types";

interface ProductCarouselProps {
	products: Product[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
	products,
}) => {
	const navigate = useNavigate();
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps",
		dragFree: true,
	});

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	if (products.length === 0) return null;

	return (
		<div className="relative group/carousel">
			<div className="absolute -top-18 right-0 z-10">
				<ButtonGroup>
					<Button variant="outline" size="icon" onClick={scrollPrev}>
						<RiArrowLeftSLine />
					</Button>
					<Button variant="outline" size="icon" onClick={scrollNext}>
						<RiArrowRightSLine />
					</Button>
				</ButtonGroup>
			</div>

			{/* Carousel Viewport */}
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex gap-2 sm:gap-4 lg:gap-6 touch-pan-y">
					{products.map((product) => (
						<div
							key={product.id}
							className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0"
						>
							<ProductCard
								product={product as any}
								onClick={() =>
									navigate({ to: `/products/${product.id}` as any })
								}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
