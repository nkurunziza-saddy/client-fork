import { RiArrowLeftLine, RiPagesLine, RiSearchLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { ROUTES } from "@/shared/constants/routes";

interface CategoriesPageProps {
	onBack: () => void;
	onSupplierClick?: (supplierId: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onBack }) => {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: categoriesResult, isLoading } = useGetProductCategoriesQuery({
		limit: 50,
	});
	const categories = categoriesResult?.data || [];

	const filtered = searchQuery.trim()
		? categories.filter(
				(c: { name: string; description?: string }) =>
					c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(c.description ?? "")
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			)
		: categories;

	return (
		<div className="min-h-screen bg-background">
			<div className="bg-background border-b-2 border-border sticky top-0 z-30 h-20 flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
					<Button
						variant="ghost"
						onClick={onBack}
						className="gap-2 font-display font-bold uppercase text-xs tracking-[0.2em] rounded-none hover:bg-muted/50 border border-transparent hover:border-border/20 px-4"
					>
						<RiArrowLeftLine className="w-4 h-4" />
						Back
					</Button>
					<div className="relative flex-1 max-w-md group">
						<RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
						<Input
							placeholder="Search categories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-12 rounded-none border-border/20 bg-muted/5 focus:bg-background h-11 font-display font-medium uppercase tracking-widest text-xs"
						/>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-3xl md:text-4xl font-display font-bold uppercase text-foreground mb-4 tracking-tighter leading-none">
					Product Categories
				</h1>
				<p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.3em] mb-12">
					Discover specialized materials and services
				</p>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 9 }).map((_, i) => (
							<div
								key={`skeleton-${i}`}
								className="h-40 rounded-none border border-border/10 bg-muted/10 animate-pulse"
							/>
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className="py-20 flex justify-center">
						<Empty className="max-w-md">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<RiPagesLine className="w-4 h-4 text-primary" />
								</EmptyMedia>
								<EmptyTitle className="text-xl font-display font-black uppercase">
									No Categories Found
								</EmptyTitle>
								<EmptyDescription className="uppercase tracking-widest text-[10px]">
									We couldn't find any categories matching your current search.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filtered.map((category) => (
							<Link
								key={category.id}
								to={ROUTES.PUBLIC.PRODUCTS}
								search={{ category: category.id }}
								className="group text-left p-8 rounded-none border border-border/10 bg-card hover:border-primary/40 transition-all duration-500 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5"
							>
								<div className="absolute top-0 left-0 w-px h-full bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />

								<div className="w-12 h-12 rounded-none bg-muted/20 border border-border/10 flex items-center justify-center mb-6 text-muted-foreground/60 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
									<RiPagesLine className="w-6 h-6" />
								</div>
								<h2 className="text-lg font-display font-bold uppercase text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
									{category.name}
								</h2>
								<p className="text-muted-foreground/60 text-[10px] font-medium uppercase tracking-widest leading-relaxed line-clamp-2">
									{category.description ||
										"Explore products and services in this category."}
								</p>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CategoriesPage;
