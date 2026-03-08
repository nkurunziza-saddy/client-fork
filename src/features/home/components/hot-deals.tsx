import { RiArrowRightLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/marketplace/components/catalog/product-card";
import { useGetProductsQuery } from "@/services/api/products";
import {
	useAddToWishlistMutation,
	useGetWishlistQuery,
	useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import type { RootState } from "@/store";
import { HomeSection } from "./home-section";
import { SectionHeader } from "./section-header";

const HotDeals: React.FC = () => {
	const navigate = useNavigate();
	const { data: productsResult, isLoading } = useGetProductsQuery({
		hasDiscount: true,
		limit: 5,
	});
	const listings = productsResult?.data || [];

	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [addToWishlist] = useAddToWishlistMutation();
	const [removeFromWishlist] = useRemoveFromWishlistMutation();

	const handleToggleWishlist = async (
		e: React.MouseEvent,
		productId: string,
	) => {
		e.stopPropagation();
		if (!isAuthenticated) {
			toast.error("Please login to add to wishlist");
			return;
		}
		try {
			const isInWishlist = wishlist.some(
				(l: { id: string }) => l.id === productId,
			);
			if (isInWishlist) {
				await removeFromWishlist({ id: productId, type: "product" }).unwrap();
				toast.success("Removed from wishlist");
			} else {
				await addToWishlist({ id: productId, type: "product" }).unwrap();
				toast.success("Added to wishlist");
			}
		} catch (_error) {
			toast.error("Failed to update wishlist");
		}
	};

	if (!isLoading && listings.length === 0) return null;

	return (
		<HomeSection
			id="flash-deals"
			variant="red"
			className="py-12 lg:py-20 border-y border-primary/20"
			withGrid
		>
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
				<SectionHeader
					title="Discounted Listings"
					subtitle="Products and materials currently available at reduced prices. Verified stock only."
					label="Special Offers"
					titleClassName="text-primary"
				/>
			</div>

			{listings.length === 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
					{[...Array(5)].map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="aspect-4/5 rounded-none border border-border/40 bg-muted/20"
						/>
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-4 lg:gap-6">
					{listings.map((prod) => (
						<ProductCard
							key={prod.id}
							product={prod as any}
							onClick={() => navigate({ to: `/products/${prod.id}` as any })}
							isInWishlist={wishlist.some(
								(l: { id: string }) => l.id === prod.id,
							)}
							onToggleWishlist={(e) => handleToggleWishlist(e, prod.id)}
						/>
					))}
				</div>
			)}

			<div className="mt-12 text-center">
				<Button
					variant="outline"
					size="lg"
					onClick={() =>
						navigate({ to: "/products", search: { sort: "deals" } as any })
					}
					className="rounded-none border-primary/40 text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-[0.3em] text-[10px] px-10 h-14"
				>
					View All Offers <RiArrowRightLine className="ml-2" />
				</Button>
			</div>
		</HomeSection>
	);
};

export default HotDeals;
