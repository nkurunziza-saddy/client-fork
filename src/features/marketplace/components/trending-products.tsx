import { TrendingUp } from "lucide-react";
import type React from "react";
import { HomeSection } from "@/features/home/components/home-section";
import { ProductCarousel } from "@/features/home/components/product-carousel";
import { SectionHeader } from "@/features/home/components/section-header";
import { useGetProductsQuery } from "@/services/api/products";

const TrendingProducts: React.FC = () => {
	const { data, isLoading } = useGetProductsQuery({
		limit: 10,
		sortBy: "views",
		sortOrder: "DESC",
	});
	const products = data?.data ?? [];

	if (!isLoading && products.length === 0) return null;

	return (
		<HomeSection
			id="trending"
			variant="white"
			withGrid
			borderTop
			borderBottom
			className="py-16 lg:py-32"
		>
			<div className="space-y-16">
				<SectionHeader
					title="Trending Products"
					subtitle="Most viewed products currently available on the marketplace."
					label="Popular"
					viewAllHref="/products?sort=trending"
					viewAllLabel="View Trending"
					icon={<TrendingUp className="w-5 h-5" />}
				/>

				{products.length === 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={`trending-skeleton-${i}`}
								className="aspect-4/3 rounded-lg border border-border/40 bg-muted/20 animate-pulse"
							/>
						))}
					</div>
				) : (
					<ProductCarousel products={products as any} />
				)}
			</div>
		</HomeSection>
	);
};

export default TrendingProducts;
