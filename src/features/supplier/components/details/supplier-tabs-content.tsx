import {
  Calendar,
  CheckCircle,
  Filter,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Star,
  Truck,
} from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { Product } from "@/types";

interface SupplierTabsContentProps {
  company: any;
  listings: Product[];
  featuredListings: Product[];
  onProductClick: (item: Product) => void;
}

function firstPrice(product: Product): number {
  if (product.price) return Number(product.price);
  return product.variants?.[0] ? Number(product.variants[0].price) : 0;
}

function firstImage(product: Product): string | null {
  if (product.images?.length) return product.images[0];
  const imgs = product.variants?.[0]?.images;
  return imgs?.length ? imgs[0] : null;
}

export const SupplierTabsContent: React.FC<SupplierTabsContentProps> = ({
  company,
  listings,
  featuredListings,
  onProductClick,
}) => {
  // Use product images for the gallery if no dedicated gallery exists
  const galleryImages = useMemo(() => {
    const imgs = listings
      .flatMap((p) => p.images || [])
      .filter(Boolean)
      .slice(0, 6);

    return imgs.length > 0 ? imgs : ["/logo.svg"];
  }, [listings]);

  return (
    <>
      <TabsContent
        value="overview"
        className="space-y-12 animate-in slide-in-from-bottom-2 duration-500 fade-in mt-8"
      >
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column (2/3) */}
          <div className="md:col-span-2 space-y-12">
            {/* Services & Capabilities */}
            <div>
              {company?.capabilities?.length > 0 && (
                <>
                  <h3 className="font-heading font-bold uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 text-foreground/40">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" /> Our
                    Capabilities
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {company.capabilities.map((item: string) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 border border-border/40 bg-muted/5"
                      >
                        <div className="w-1 h-1 bg-primary/40 rotate-45" />
                        <span className="text-[11px] font-black uppercase tracking-tight text-foreground/70">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Gallery */}
            <div>
              <h3 className="font-heading font-bold uppercase text-xs tracking-[0.2em] mb-6 text-foreground/40">
                Photos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="aspect-video bg-muted relative group overflow-hidden border border-border/40"
                  >
                    <ImageWithFallback
                      src={src}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold uppercase text-xs tracking-[0.2em] text-foreground/40">
                  Featured Products
                </h3>
                <Button
                  variant="link"
                  className="text-primary text-[10px] font-black uppercase tracking-widest p-0 h-auto"
                >
                  Open Catalog
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {featuredListings.map((product) => {
                  const img = firstImage(product);
                  const price = firstPrice(product);
                  return (
                    <button
                      key={product.id}
                      onClick={() => onProductClick(product)}
                      className="flex gap-4 p-4 border border-border bg-background group hover:border-primary/40 transition-colors text-left w-full rounded-none"
                    >
                      <div className="w-20 h-20 bg-muted shrink-0 overflow-hidden">
                        {img && (
                          <ImageWithFallback
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-heading font-black text-xs uppercase leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
                          {product.category?.name || "General Material"}
                        </div>
                        <div className="font-black text-xs text-foreground uppercase tracking-tight">
                          RWF {price.toLocaleString()}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1/3) - Sidebar Info */}
          <div className="space-y-8">
            {/* Logistics Configuration */}
            <div className="border border-border p-6 bg-muted/5">
              <h3 className="font-heading font-bold uppercase text-[10px] tracking-[0.2em] mb-6 flex items-center gap-2 text-foreground/40">
                <Truck className="w-3.5 h-3.5 text-primary" /> Delivery Options
              </h3>

              <ul className="space-y-4">
                {[
                  { label: "Intra-City (Kigali)", desc: "24H Response" },
                  { label: "Regional Transit", desc: "48-72H Lead Time" },
                  { label: "Bulk Transport", desc: "Custom Quote" },
                ].map((opt) => (
                  <li
                    key={opt.label}
                    className="flex justify-between items-start border-b border-border/20 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-black uppercase text-[10px] text-foreground/80 tracking-tight">
                      {opt.label}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                      {opt.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="products" className="mt-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {listings.length} Active Listings
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-[10px] font-black uppercase tracking-widest rounded-none border-border/40"
            >
              <Filter className="w-3 h-3" /> Filter Channels
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((product) => {
              const img = firstImage(product);
              const price = firstPrice(product);
              return (
                <div
                  key={product.id}
                  className="group border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer rounded-none overflow-hidden"
                  onClick={() => onProductClick(product)}
                >
                  <div className="aspect-square bg-muted overflow-hidden relative">
                    {img && (
                      <ImageWithFallback
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    {!img && (
                      <div className="flex items-center justify-center h-full text-muted-foreground/30">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-heading font-black text-[11px] uppercase leading-tight line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                      {product.name}
                    </h4>
                    <div className="font-black text-xs uppercase tracking-tight text-foreground/80">
                      RWF {price.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-8">
        <div className="border border-border p-8 bg-muted/5 space-y-8">
          <div className="flex items-center gap-8 pb-8 border-b border-border">
            <div className="text-center">
              <div className="text-5xl font-black font-display text-foreground tracking-tighter">
                {Number(company.averageRating || 0).toFixed(1)}
              </div>
              <div className="flex gap-0.5 justify-center my-3 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-primary" />
                ))}
              </div>{" "}
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">
                {company.reviewCount || 0} Reviews
              </div>
            </div>
            <div className="flex-1 space-y-3 max-w-xs">
              {[5, 4, 3, 2, 1].map((rating, i) => (
                <div
                  key={rating}
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40"
                >
                  <span className="w-2">{rating}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-none overflow-hidden">
                    <div
                      className="h-full bg-primary/60"
                      style={{
                        width: i === 0 ? "92%" : "4%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10 pt-4">
            {company.reviewCount === 0 || !company.reviewCount ? (
              <div className="text-center py-12 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                No reviews yet
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                Reviews disabled
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="contact"
        className="animate-in slide-in-from-bottom-2 duration-500 fade-in mt-8"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="font-heading font-black uppercase text-xs tracking-[0.2em] text-foreground/40 border-b border-border/40 pb-4">
              Contact Channels
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Business Email",
                  value: company?.email || "NOT PROVIDED",
                  icon: Mail,
                },
                {
                  label: "Direct Phone",
                  value: company.phone || "NOT PROVIDED",
                  icon: Phone,
                },
                {
                  label: "Official Hub",
                  value: company.phone || "STANDBY",
                  icon: MessageCircle,
                },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href="#"
                  className="flex items-center gap-4 p-5 border border-border/40 bg-background hover:border-primary/40 transition-all group rounded-none shadow-sm"
                >
                  <div className="w-10 h-10 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-primary/10">
                    <contact.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                      {contact.label}
                    </div>
                    <div className="font-black text-xs text-foreground uppercase tracking-tight">
                      {contact.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-4">
              <Button className="w-full h-12 font-heading font-black uppercase tracking-[0.2em] text-[10px] gap-3 rounded-none bg-foreground text-background hover:bg-foreground/90 shadow-xl transition-all">
                <MessageCircle className="w-4 h-4" /> Start Chat
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-heading font-black uppercase text-xs tracking-[0.2em] text-foreground/40 border-b border-border/40 pb-4">
              Business Hours
            </h3>
            <div className="border border-border/40 bg-muted/5 p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary opacity-60" />
                  <span className="font-black uppercase text-[10px] tracking-widest text-foreground/80">
                    Business Hours
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground">
                  08:00 - 18:00 CAT
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground/40" />
                  <span className="font-black uppercase text-[10px] tracking-widest text-foreground/80">
                    Extended Saturday
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground">
                  09:00 - 16:00 CAT
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground/40 grayscale">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span className="font-black uppercase text-[10px] tracking-widest">
                    Sunday
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase">
                  Closed
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
};
