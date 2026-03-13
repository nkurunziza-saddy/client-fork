import { RiPagesLine } from "@remixicon/react";
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

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const { data: productsResult, isLoading } = useGetProductsQuery({
    isFeatured: true,
    limit: 10,
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
      id="marketplace"
      variant="background"
      className="py-10 lg:py-16"
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <SectionHeader
          title="Featured Products"
          subtitle="High-quality construction materials and specialized tools for your next project."
          label="Products"
          icon={<RiPagesLine className="w-5 h-5" />}
          viewAllHref="/products"
          viewAllLabel="View all products"
        />

        {listings.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg border border-border/40 bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {listings.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, itemType: "PRODUCT" }}
                onClick={() => navigate({ to: `/products/${product.id}` })}
                isInWishlist={wishlist.some(
                  (l: { id: string }) => l.id === product.id,
                )}
                onToggleWishlist={(e) => handleToggleWishlist(e, product.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 md:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              navigate({
                to: "/products",
              })
            }
          >
            View all products
          </Button>
        </div>
      </div>
    </HomeSection>
  );
};

export default FeaturedProducts;
