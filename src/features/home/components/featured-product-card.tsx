import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { HeroFeaturedProduct } from "@/shared/utils/transformers";

export const FeaturedProductCard: React.FC<{
  product: HeroFeaturedProduct;
  isActive?: boolean;
}> = ({ product, isActive = true }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isActive
          ? "opacity-100 pointer-events-auto scale-100"
          : "opacity-0 pointer-events-none scale-105"
      } transition-transform`}
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-industrial via-industrial/40 to-transparent" />
        <div className="absolute inset-0 bg-industrial/20" />
      </div>

      {/* Top Bar with Badges */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <Badge className="bg-primary text-primary-foreground border-none text-[9px] font-black tracking-[0.2em] px-2.5 py-1.5 h-auto rounded-none uppercase shadow-xl">
          {product.tag}
        </Badge>
        {product.discount && (
          <div className="bg-success text-success-foreground text-[9px] font-black rounded-none px-2 py-1 uppercase tracking-widest shadow-xl">
            {product.discount}
          </div>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 pt-10 md:pt-20 pb-12 bg-gradient-to-t from-industrial to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-px bg-primary" />
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
            {product.category}
          </p>
        </div>

        <h3 className="text-white font-black text-xl md:text-3xl lg:text-4xl leading-tight mb-3 uppercase tracking-tighter">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-5 opacity-70">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-2 h-2 ${
                  star <= Math.floor(product.rating)
                    ? "fill-warning text-warning"
                    : "fill-white/20 text-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-white text-[8px] font-black uppercase tracking-widest">
            {product.rating > 0 ? product.rating : "N/A"} · {product.reviews}{" "}
            VIEWS
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="inline-flex flex-col gap-0.5 border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-white/60 text-[9px] line-through font-bold">
                {product.originalPrice}
              </span>
            )}
          </div>
          <Button
            onClick={() => navigate({ to: "/products" })}
            className="bg-background hover:bg-muted text-foreground rounded-none h-10 px-6 text-[9px] font-black tracking-[0.2em] uppercase gap-2 group border-none"
          >
            VIEW{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
