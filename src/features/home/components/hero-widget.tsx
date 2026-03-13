import { RiArrowRightLine, RiStarLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { HeroWidgetItem } from "@/types";

interface HeroWidgetProps {
  title: string;
  subtitle?: string;
  items: HeroWidgetItem[];
  href: string;
  className?: string;
  variant?: "default" | "blue" | "emerald" | "orange";
}

export const HeroWidget: React.FC<HeroWidgetProps> = ({
  title,
  subtitle,
  items,
  href,
  className,
  variant = "default",
}) => {
  const maxItems = 4;
  const displayItems = items.length > 0 ? items.slice(0, maxItems) : [];
  const ordinals = ["01", "02", "03", "04"];

  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return "group-hover:border-info/30";
      case "emerald":
        return "group-hover:border-success/30";
      case "orange":
        return "group-hover:border-primary/30";
      default:
        return "group-hover:border-primary/30";
    }
  };

  const getTextAccentColor = () => {
    switch (variant) {
      case "blue":
        return "text-info";
      case "emerald":
        return "text-success";
      case "orange":
        return "text-primary";
      default:
        return "text-primary";
    }
  };

  const getBgAccentColor = () => {
    switch (variant) {
      case "blue":
        return "bg-info";
      case "emerald":
        return "bg-success";
      case "orange":
        return "bg-primary";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={cn(
        "bg-background border border-border/20 flex flex-col h-full transition-all duration-300 relative group/widget rounded-none overflow-hidden hover:shadow-2xl hover:shadow-primary/5",
        "p-4 sm:p-6",
        getVariantStyles(),
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-20 h-20 blueprint-grid opacity-[0.02] pointer-events-none" />

      <div
        className={cn(
          "absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300",
          getBgAccentColor(),
        )}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="font-display font-extrabold text-lg text-foreground tracking-tight flex items-center gap-2 uppercase leading-none">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[8px] text-muted-foreground/50 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="w-3 h-px bg-primary/20" />
              {subtitle}
            </p>
          )}
        </div>
        <Link
          to={href as "/products"}
          className="text-muted-foreground/40 hover:text-primary transition-all p-1 group/link border border-border/10 hover:border-primary/40 rounded-none bg-muted/5"
        >
          <RiArrowRightLine className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {displayItems.map((item, idx) => {
          if (!item) {
            return (
              <div
                key={`placeholder-${idx}`}
                className="group/item flex flex-col relative"
              >
                <div className="absolute -left-2 top-2 text-[8px] font-bold text-muted-foreground/5 uppercase tracking-widest transform -rotate-90 pointer-events-none">
                  {ordinals[idx] || `${idx + 1}`.padStart(2, "0")}
                </div>
                <div className="h-20 bg-muted/10 border border-border/10 rounded-none animate-pulse" />
              </div>
            );
          }

          const linkTarget =
            item.type === "supplier"
              ? ({
                  to: "/suppliers/$supplierId",
                  params: { supplierId: item.id },
                } as const)
              : item.type === "service"
                ? ({
                    to: "/services/$serviceId",
                    params: { serviceId: item.id },
                  } as const)
                : ({
                    to: "/products/$productId",
                    params: { productId: item.id },
                  } as const);

          return (
            <div key={item.id} className="group/item flex flex-col relative">
              <div className="absolute -left-2 top-2 text-[8px] font-bold text-muted-foreground/5 uppercase tracking-widest transform -rotate-90 pointer-events-none group-hover/item:text-primary/15 transition-colors">
                {ordinals[idx] || `${idx + 1}`.padStart(2, "0")}
              </div>
              {item.type === "stat" ? (
                <Link
                  to={href as "/products"}
                  className="h-20 bg-muted/15 rounded-none p-4 border border-border/10 hover:border-primary/40 transition-all flex flex-col justify-center items-start relative overflow-hidden group-hover/widget:bg-muted/25"
                >
                  <div className="absolute right-[-5%] top-[-10%] text-5xl font-extrabold text-foreground/2 italic pointer-events-none">
                    {idx + 1}
                  </div>
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "text-3xl font-extrabold font-display leading-none mb-0.5 tracking-tighter group-hover/item:translate-x-1.5 transition-transform duration-700 ease-out",
                        getTextAccentColor(),
                      )}
                    >
                      {item.stat}
                    </div>
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 leading-tight">
                      {item.statDesc}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  to={linkTarget.to ?? ""}
                  params={linkTarget.params}
                  className="flex gap-3 p-2 bg-muted/5 border border-border/10 rounded-none hover:bg-muted/15 hover:border-primary/40 transition-all group/link relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover/link:opacity-100 transition-opacity">
                    <div className="absolute top-0 right-0 w-px h-full bg-primary/10" />
                    <div className="absolute top-0 right-0 w-full h-px bg-primary/10" />
                  </div>

                  {/* Image Container */}
                  <div className="h-16 w-16 shrink-0 bg-muted rounded-none overflow-hidden border border-border/10 group-hover/item:border-primary/30 transition-all duration-300 relative">
                    {item.image ? (
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name || "Item Image"}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000 ease-out"
                        fallbackSrc="/logo.svg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                        <div className="text-lg font-black opacity-15 font-display">
                          {item.name?.charAt(0)}
                        </div>
                      </div>
                    )}

                    {item.label && (
                      <div
                        className={cn(
                          "absolute top-0 left-0 text-[5px] font-black text-white px-1 py-0.5 z-10 uppercase tracking-[0.1em] leading-none",
                          getBgAccentColor(),
                        )}
                      >
                        {item.label}
                      </div>
                    )}

                    {item.type === "supplier" && item.rating && (
                      <div className="absolute bottom-0 right-0 bg-background/95 backdrop-blur-sm text-foreground px-1 py-0.5 text-[7px] font-black flex items-center gap-0.5 border-tl border-border/10">
                        <RiStarLine className="w-1.5 h-1.5 fill-primary text-primary" />
                        {item.rating}
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center gap-0.5 py-0">
                    <h4 className="text-[10px] font-black text-foreground uppercase tracking-tight line-clamp-1 group-hover/item:text-primary transition-colors leading-tight">
                      {item.name || "Item Name"}
                    </h4>

                    {item.type === "supplier" ? (
                      <div className="text-[7px] font-black text-muted-foreground/30 truncate uppercase tracking-widest leading-none">
                        {item.subtext}
                      </div>
                    ) : item.type === "service" ? (
                      <div className="flex flex-col gap-0">
                        <div className="text-[7px] font-black text-muted-foreground/30 truncate uppercase tracking-widest leading-none">
                          {item.subtext}
                        </div>
                        <div className="text-[9px] font-black text-primary font-display tracking-tight leading-tight">
                          {typeof item.price === "number"
                            ? `RWF ${item.price.toLocaleString()}`
                            : item.price}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0">
                        {item.subtext && (
                          <div className="text-[7px] font-black text-muted-foreground/30 truncate uppercase tracking-widest leading-none">
                            {item.subtext}
                          </div>
                        )}
                        {item.price && (
                          <div
                            className={cn(
                              "text-[9px] font-black font-display tracking-tight text-primary leading-tight",
                            )}
                          >
                            {typeof item.price === "number"
                              ? `RWF ${item.price.toLocaleString()}`
                              : item.price}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
