import { RiArrowRightLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;
  icon?: React.ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  titleClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  label,
  viewAllHref,
  viewAllLabel = "View All",
  titleClassName,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-6 md:mb-12 group">
      <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-primary/20 hidden lg:block" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-12">
        <div className="space-y-2 md:space-y-4">
          {label && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 sm:w-10 h-px bg-primary" />
              <span className="text-[8px] sm:text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                {label}
              </span>
            </div>
          )}
          <h2
            className={cn(
              "text-xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight leading-[0.9] uppercase",
              titleClassName,
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground/60 text-[10px] sm:text-xs md:text-sm max-w-2xl font-medium leading-relaxed uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <div className="flex shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: viewAllHref })}
              className="border border-border/40 hover:bg-foreground hover:text-background rounded-none font-bold transition-all px-4 sm:px-6 h-9 sm:h-10 uppercase text-[9px] sm:text-[10px] tracking-[0.2em] group/btn shadow-none bg-transparent w-full sm:w-auto"
            >
              {viewAllLabel}
              <RiArrowRightLine className="ml-2 sm:ml-3 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 md:mt-12 h-px bg-border/20 w-full relative">
        <div className="absolute left-0 top-0 w-16 sm:w-24 h-px bg-primary/40" />
      </div>
    </div>
  );
};
