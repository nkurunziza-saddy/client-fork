import { RiShieldCheckLine, RiStarLine } from "@remixicon/react";
import { useRouter } from "@tanstack/react-router";
import type React from "react";
import { ResourceCard } from "@/shared/components/catalog/resource-card";
import { formatCurrency } from "@/shared/utils/format";
import type { MarketplaceItem } from "@/types";

interface ProductCardProps {
  product: MarketplaceItem;
  viewMode?: "grid" | "list";
  onSupplierClick?: (e: React.MouseEvent) => void;
  onClick: () => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
  onSupplierClick,
  onClick,
  isInWishlist,
  onToggleWishlist,
}) => {
  const router = useRouter();

  const variant = "variants" in product ? product.variants?.[0] : null;
  const basePrice = Number(
    variant?.price || ("price" in product ? product.price : 0),
  );
  const discount = Number(
    variant?.discount || ("discount" in product ? product.discount : 0),
  );
  const price = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  const img =
    variant?.images?.[0] || ("images" in product ? product.images?.[0] : null);
  const unit = variant?.unit || ("unit" in product ? product.unit : "UNIT");
  const company = product.company;

  const handleMouseEnter = () => {
    router.preloadRoute({
      to: "/products/$productId",
      params: { productId: product.id },
    });
  };

  const badges = (
    <>
      {product.isFeatured && (
        <div className="bg-warning text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-widest shadow-2xl">
          Featured
        </div>
      )}
      {discount > 0 && (
        <div className="bg-success text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-widest shadow-2xl">
          {discount}% OFF
        </div>
      )}
    </>
  );

  const footer = company && (
    <div
      role="button"
      tabIndex={0}
      className="flex items-start justify-between gap-2 group/comp cursor-pointer"
      onClick={(e) => {
        if (onSupplierClick) {
          e.stopPropagation();
          onSupplierClick(e);
        }
      }}
    >
      <div className="flex items-start gap-2 overflow-hidden text-left text-foreground/80 hover:text-primary transition-colors">
        <div className="w-5 h-5 md:w-7 md:h-7 bg-muted/20 border border-border/10 flex items-center justify-center rounded-none shrink-0 text-[10px] font-bold text-primary">
          {company.name?.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight truncate">
              {company.name}
            </span>
            {company.isVerified && (
              <RiShieldCheckLine
                size={10}
                className="text-success shrink-0 opacity-80"
              />
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 text-[8px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-0.5">
            <span>{company.type}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-border" />
            <span>{company.district}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResourceCard
      id={product.id}
      name={product.name}
      image={img}
      categoryName={product.category?.name}
      viewMode={viewMode}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      isInWishlist={isInWishlist}
      onToggleWishlist={onToggleWishlist}
      badges={badges}
      footer={footer}
    >
      <div className="space-y-2">
        <div className="flex flex-col">
          <div className="flex items-end gap-1.5">
            <div className="text-sm font-bold text-foreground font-display tracking-tight">
              {formatCurrency(price, "RWF")}
            </div>
            <div className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-px">
              / {unit}
            </div>
          </div>
          {discount > 0 && (
            <div className="text-[9px] font-bold text-muted-foreground/30 line-through mt-0.5 uppercase tracking-widest leading-none">
              {formatCurrency(basePrice, "RWF")}
            </div>
          )}
        </div>

        {viewMode === "grid" && (
          <div className="hidden md:flex items-center gap-1 opacity-60">
            <RiStarLine size={10} className="text-warning fill-warning" />
            <span className="text-[10px] font-bold text-foreground font-display">
              -
            </span>
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              ({product.views || 0} views)
            </span>
          </div>
        )}

        {viewMode === "list" && (
          <p className="text-sm text-muted-foreground/70 line-clamp-2 mt-3 max-w-3xl leading-relaxed text-left">
            {product.description}
          </p>
        )}
      </div>
    </ResourceCard>
  );
};
