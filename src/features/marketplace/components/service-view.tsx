import {
  RiArrowLeftLine,
  RiBuilding4Line,
  RiHistoryLine,
  RiPriceTag3Line,
} from "@remixicon/react";
import { useRouter } from "@tanstack/react-router";
import { useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServiceActions } from "@/hooks/use-service-actions";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { Service } from "@/types";
import { ContactModal } from "./service/contact-modal";
import { MobileActions } from "./service/mobile-actions";
import { ServiceHeader } from "./service/service-header";
import { ServiceInfo } from "./service/service-info";
import { ServiceSidebar } from "./service/service-sidebar";
import { ServiceTabsContent } from "./service/service-tabs-content";

interface ServiceViewProps {
  service: Service;
  onBack?: () => void;
}

export default function ServiceView({ service, onBack }: ServiceViewProps) {
  const router = useRouter();
  const formId = useId();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    showContactModal,
    setShowContactModal,
    isInWishlist,
    handleToggleWishlist,
    trackAndNavigate,
    handleBack,
    handleSubmitInquiry,
    sendingInquiry,
  } = useServiceActions(service);

  const backHandler = onBack || handleBack;

  const mainImage = useMemo(() => {
    return service.images?.[0] || null;
  }, [service]);

  return (
    <div className="min-h-screen bg-background space-y-0 overflow-x-hidden industrial-grain pb-24">
      <MobileActions
        service={service}
        isInWishlist={isInWishlist}
        onToggleWishlist={handleToggleWishlist}
        onContactClick={() => setShowContactModal(true)}
        trackAndNavigate={trackAndNavigate}
      />

      {/* Top navigation header with service name */}
      <div className="bg-background border-b border-border/40 py-3 md:py-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={backHandler}
              className="shrink-0"
            >
              <RiArrowLeftLine className="size-4" />
            </Button>
            <div className="h-4 w-px bg-border/60 shrink-0" />
            <h1 className="font-display font-black uppercase text-xs md:text-sm tracking-widest truncate text-foreground">
              {service.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setShowContactModal(true)}
              className="hidden md:inline-flex h-8 px-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Request Quote
            </Button>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase hidden sm:block">
              {service.category?.name || "Service"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Navigation */}
        <ServiceHeader
          service={service}
          isInWishlist={isInWishlist}
          onToggleWishlist={handleToggleWishlist}
          onInquire={() => setShowContactModal(true)}
        />

        {/* Standard Service Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-2 md:pt-4">
          {/* Left Column: Visuals */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="aspect-4/5 overflow-hidden border border-border bg-muted/5 relative group">
              <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
              {mainImage ? (
                <ImageWithFallback
                  src={mainImage}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Key Details & Actions */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-10">
            <ServiceInfo
              service={service}
              onInquire={() => setShowContactModal(true)}
            />

            {/* Quick Specs Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border/40 border border-border/40 overflow-hidden shadow-sm">
              <div className="bg-background p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <RiPriceTag3Line size={12} className="text-primary" />
                  Category
                </span>
                <span className="text-[11px] font-bold uppercase truncate">
                  {service.category?.name || "Professional Service"}
                </span>
              </div>
              <div className="bg-background p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <RiHistoryLine size={12} className="text-primary" />
                  Activity
                </span>
                <span className="text-[11px] font-bold uppercase">
                  {service.totalRequests || 0} Total Inquiries
                </span>
              </div>
              <div className="bg-background p-4 flex flex-col gap-1 col-span-2 md:col-span-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <RiBuilding4Line size={12} className="text-primary" />
                  Supplier
                </span>
                <span className="text-[11px] font-bold uppercase truncate">
                  {service.company?.name || "Verified Provider"}
                </span>
              </div>
            </div>

            {/* Provider Section */}
            <div className="pt-2">
              <ServiceSidebar
                service={service}
                onViewBio={() =>
                  router.navigate({ to: `/suppliers/${service.company?.id}` })
                }
              />
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="pt-12 border-t border-border/40">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="relative mb-8">
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto scrollbar-hide no-scrollbar flex-nowrap bg-muted/10 border border-border/40 rounded-none h-auto px-2 md:px-3 py-1 gap-4 sm:gap-6"
              >
                <TabsTrigger
                  value="overview"
                  className="uppercase text-[10px] font-semibold tracking-[0.2em] px-3 py-2 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Service Info
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="uppercase text-[10px] font-semibold tracking-[0.2em] px-3 py-2 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Related Items
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="uppercase text-[10px] font-semibold tracking-[0.2em] px-3 py-2 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Customer Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="uppercase text-[10px] font-semibold tracking-[0.2em] px-3 py-2 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Contact Us
                </TabsTrigger>
              </TabsList>
              {/* Fade indicator for scroll */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <TabsContent value="overview">
                <ServiceTabsContent
                  service={service}
                  activeTab="overview"
                  trackAndNavigate={trackAndNavigate}
                />
              </TabsContent>
              <TabsContent value="products">
                <ServiceTabsContent
                  service={service}
                  activeTab="products"
                  trackAndNavigate={trackAndNavigate}
                />
              </TabsContent>
              <TabsContent value="reviews">
                <ServiceTabsContent
                  service={service}
                  activeTab="reviews"
                  trackAndNavigate={trackAndNavigate}
                />
              </TabsContent>
              <TabsContent value="contact">
                <ServiceTabsContent
                  service={service}
                  activeTab="contact"
                  trackAndNavigate={trackAndNavigate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {showContactModal && (
        <ContactModal
          service={service}
          formId={formId}
          sendingInquiry={sendingInquiry}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleSubmitInquiry}
        />
      )}
    </div>
  );
}
