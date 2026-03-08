import { RiTrophyLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/marketplace/components/catalog/product-card";
import { useGetProductsQuery } from "@/services/api/products";
import { HomeSection } from "./home-section";
import { SectionHeader } from "./section-header";

const BestSellers: React.FC = () => {
	const navigate = useNavigate();
	const sectionId = useId();
	const { data: productsResult, isLoading } = useGetProductsQuery({
		sortBy: "views",
		sortOrder: "DESC",
		limit: 10,
	});
	const listings = productsResult?.data || [];

	if (!isLoading && listings.length === 0) return null;

	return (
		<HomeSection id={sectionId} variant="background" className="py-8 lg:py-12">
			<SectionHeader
				title="Best Sellers"
				subtitle="The most viewed products and materials on the marketplace."
				label="Most Viewed"
				icon={<RiTrophyLine className="w-5 h-5" />}
				viewAllHref="/products?sort=popular"
				viewAllLabel="View All"
			/>

			{isLoading || listings.length === 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={`best-seller-skeleton-${i}`}
							className="aspect-4/5 rounded-lg border border-border/40 bg-muted/20 animate-pulse"
						/>
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-4 lg:gap-6">
					{listings.map((prod) => (
						<ProductCard
							key={prod.id}
							product={prod as any}
							onClick={() =>
								navigate({
									to: "/products/$productId",
									params: { productId: prod.id },
								})
							}
						/>
					))}
				</div>
			)}

			<div className="mt-8 md:hidden">
				<Button
					variant="outline"
					size="lg"
					onClick={() => navigate({ to: "/products" })}
				>
					View all best sellers
				</Button>
			</div>
		</HomeSection>
	);
};

export default BestSellers;
