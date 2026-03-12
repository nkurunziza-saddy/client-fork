import { Package } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { HomeSection } from "@/features/home/components/home-section";
import { SectionHeader } from "@/features/home/components/section-header";
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { CompactCategoryCard } from "./compact-category-card";

const CategoryGrid: React.FC = () => {
	const sectionId = useId();
	const { data: categoriesResult, isLoading } = useGetProductCategoriesQuery({
		limit: 8,
	});
	const categories = categoriesResult?.data || [];

	if (!isLoading && categories.length === 0) return null;

	return (
		<HomeSection
			id={sectionId}
			variant="muted"
			withGrid
			borderTop
			borderBottom
			className="py-8 sm:py-16 lg:py-24"
		>
			<div className="space-y-8 sm:space-y-16">
				<SectionHeader
					title="Market Categories"
					subtitle="Discover specialized materials and services organized by industry sector."
					label="Industry Sectors"
					icon={<Package className="w-5 h-5" />}
					viewAllHref="/categories"
					viewAllLabel="All Categories"
				/>

				{isLoading || categories.length === 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={`category-skeleton-${i}`}
								className="h-32 sm:h-40 rounded-lg border border-border/40 bg-muted/20 animate-pulse"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
						{categories.map((category: { id: string; name: string }) => (
							<CompactCategoryCard
								key={category.id}
								category={category as any}
							/>
						))}
					</div>
				)}
			</div>
		</HomeSection>
	);
};

export default CategoryGrid;
