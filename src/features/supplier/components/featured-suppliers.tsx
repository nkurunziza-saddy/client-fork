import {
  RiCheckboxCircleLine,
  RiMapPinLine,
  RiShieldCheckLine,
  RiStarFill,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";
import { HomeSection } from "@/features/home/components/home-section";
import { SectionHeader } from "@/features/home/components/section-header";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetProductsQuery } from "@/services/api/products";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { Product } from "@/types";

const CompanyAssetsPreview: React.FC<{ companyId: string }> = ({
  companyId,
}) => {
  const { data, isLoading } = useGetProductsQuery({ companyId, limit: 4 });
  const products = data?.data || [];

  return (
    <div className="grid grid-cols-4 gap-1">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-none bg-muted/30 border border-border/20 animate-pulse"
            />
          ))
        : products.length > 0
          ? products.map((product: Product) => (
              <div
                key={product.id}
                className="aspect-square rounded-none bg-muted/30 border border-border/20 overflow-hidden relative group/asset"
              >
                <ImageWithFallback
                  src={
                    product.variants?.[0]?.images?.[0] ??
                    `https://images.unsplash.com/photo-1581091226825?auto=format&fit=crop&q=80&w=100`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-all group-hover/asset:scale-110"
                />
              </div>
            ))
          : [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-none bg-muted/30 border border-border/20 overflow-hidden relative"
              >
                <div className="w-full h-full bg-muted flex items-center justify-center opacity-20">
                  <div className="w-4 h-[1px] bg-foreground rotate-45 absolute" />
                  <div className="w-4 h-[1px] bg-foreground -rotate-45 absolute" />
                </div>
              </div>
            ))}
    </div>
  );
};

const FeaturedSuppliers: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCompaniesQuery({
    limit: 6,
    isVerified: true,
  });
  const companies = data?.data || [];

  if (!isLoading && companies.length === 0) return null;

  return (
    <HomeSection
      id="suppliers"
      variant="white"
      withGrid
      borderTop
      className="py-16 lg:py-32"
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <SectionHeader
          title="Verified Suppliers"
          subtitle="Trusted construction companies and reliable partners."
          label="Supplier Directory"
          icon={<RiCheckboxCircleLine className="w-5 h-5" />}
          viewAllHref="/suppliers"
          viewAllLabel="View All Suppliers"
        />
        {isLoading || companies.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-none border border-border/20 bg-muted/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => {
              const rating = Number(company.averageRating ?? 0);

              return (
                <div
                  key={company.id}
                  className="group border border-border/40 hover:border-primary/40 transition-all duration-500 rounded-none bg-card cursor-pointer overflow-hidden flex flex-col relative"
                  onClick={() =>
                    navigate({
                      to: "/suppliers/$supplierId",
                      params: { supplierId: company.id },
                    })
                  }
                >
                  {/* Technical Accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-[1px] bg-border/20" />
                    <div className="absolute top-0 right-0 w-[1px] h-full bg-border/20" />
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-none bg-muted border border-border/40 flex items-center justify-center text-lg sm:text-xl font-black text-foreground shrink-0 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                          {company.name?.charAt(0) ?? "?"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-display font-black text-[10px] sm:text-xs md:text-sm text-foreground uppercase tracking-widest truncate group-hover:text-primary transition-colors leading-tight">
                              {company.name}
                            </h3>
                            <RiShieldCheckLine
                              size={12}
                              className="text-primary shrink-0 opacity-60 sm:size-[14px]"
                            />
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-[7px] sm:text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                            <RiMapPinLine
                              size={8}
                              className="text-primary/40 sm:size-[10px]"
                            />
                            {company.district || "Rwanda"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-primary justify-end mb-0.5 sm:mb-1">
                          <RiStarFill
                            size={8}
                            className="fill-current sm:size-[10px]"
                          />
                          <span className="text-[9px] sm:text-[10px] font-black font-display uppercase tracking-widest">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] text-muted-foreground font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-40">
                          {company.reviewCount} Reviews
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-3 sm:w-4 h-[1px] bg-primary/40" />
                        <p className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                          {company.type || "Supplier"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {[
                          "Structural Steel",
                          "Heavy Machinery",
                          "Logistics",
                        ].map((tag, i) => (
                          <span
                            key={i}
                            className="text-[7px] sm:text-[8px] bg-muted/30 text-muted-foreground/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-none font-black uppercase tracking-widest border border-border/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Company items */}
                    <div className="mt-auto pt-4 sm:pt-6 border-t border-border/20">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="text-[7px] sm:text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                          Latest Products
                        </div>
                        <div className="text-[7px] sm:text-[8px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                          VIEW MORE
                        </div>
                      </div>
                      <CompanyAssetsPreview companyId={company.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center md:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: "/suppliers" })}
            className="rounded-none font-black uppercase tracking-[0.3em] text-[10px] h-14 px-10 border-border/40"
          >
            View All Suppliers
          </Button>
        </div>
      </div>
    </HomeSection>
  );
};

export default FeaturedSuppliers;
