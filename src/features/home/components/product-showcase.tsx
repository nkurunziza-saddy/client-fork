import { useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/marketplace/components/catalog/product-card";
import { useGetProductsQuery } from "@/services/api/products";
import { HomeSection } from "./home-section";
import { SectionHeader } from "./section-header";

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  categoryId?: string;
  limit?: number;
  className?: string;
  icon?: React.ReactNode;
  variant?: "white" | "background" | "muted" | "dark" | "red";
  withGrid?: boolean;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  subtitle,
  categoryId,
  limit = 10,
  className = "",
  icon,
  variant = "white",
  withGrid = false,
}) => {
  const navigate = useNavigate();
  const { data: productsResult, isLoading } = useGetProductsQuery({
    categoryId,
    limit,
  });
  const listings = productsResult?.data || [];

  if (!isLoading && listings.length === 0) return null;

  return (
    <HomeSection variant={variant} withGrid={withGrid} className={className}>
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          label="Curated Selection"
          icon={icon || <Package className="w-5 h-5" />}
          viewAllHref="/products"
        />

        {listings.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/3 rounded-none border border-border/40 bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-6">
            {listings.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, itemType: "PRODUCT" as const }}
                onClick={() => navigate({ to: `/products/${product.id}` })}
              />
            ))}
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Button
            variant="outline"
            className="w-full rounded-none h-11 text-[10px] font-black uppercase tracking-widest border-border/40"
            onClick={() => {
              navigate({
                to: "/products",
                search: {
                  type: "PRODUCT",
                  category: categoryId || undefined,
                },
              });
            }}
          >
            View all {title}
          </Button>
        </div>
      </div>
    </HomeSection>
  );
};

export default ProductShowcase;
