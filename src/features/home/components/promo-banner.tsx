import { RiArrowRightLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  variant?: "primary" | "secondary" | "dark";
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink = "/products",
  variant = "primary",
}) => {
  const bgClass =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : variant === "secondary"
        ? "bg-muted text-foreground border-border border shadow-2xl"
        : "bg-industrial text-industrial-foreground border border-industrial-foreground/10 shadow-2xl shadow-primary/5";

  return (
    <section className="py-2 md:py-6 my-4 md:my-8">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
        <div
          className={`${bgClass} rounded-none p-6 md:p-12 lg:p-20 text-center md:text-left relative overflow-hidden`}
        >
          {/* Technical Grid Overlay */}
          <div
            className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black, transparent)",
            }}
          />

          {/* Technical Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 -mr-16 -mt-16 rotate-45 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-background/10 -ml-12 -mb-12 rotate-45 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <div className="w-6 h-px bg-current opacity-40" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                  Featured Promotion
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-black mb-4 tracking-tighter leading-[0.9] uppercase">
                {title}
              </h2>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl font-medium opacity-70 max-w-2xl leading-relaxed uppercase tracking-widest">
                {subtitle}
              </p>
            </div>

            <Link to={ctaLink as any} className="w-full md:w-auto shrink-0">
              <Button
                size="lg"
                className={`rounded-none h-12 md:h-16 lg:h-20 px-6 md:px-12 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95 group shrink-0 w-full md:w-auto border-none shadow-2xl ${
                  variant === "primary"
                    ? "bg-background text-foreground hover:bg-muted"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {ctaText}
                <RiArrowRightLine className="ml-3 sm:ml-4 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
