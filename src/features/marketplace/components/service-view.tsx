import {
  RiBuilding4Line,
  RiHistoryLine,
  RiPriceTag3Line,
} from "@remixicon/react";
import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServiceActions } from "@/hooks/use-service-actions";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import { DetailsPageLayout } from "@/shared/components/layouts/details-page-layout";
import { ResourceInquiryModal } from "@/shared/components/modals/resource-inquiry-modal";
import type { Service } from "@/types";
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
    <DetailsPageLayout
      title={service.name}
      badgeText={service.category?.name || "Service"}
      onBack={backHandler}
      mobileActions={
        <MobileActions
          service={service}
          isInWishlist={isInWishlist}
          onToggleWishlist={handleToggleWishlist}
          onContactClick={() => setShowContactModal(true)}
          trackAndNavigate={trackAndNavigate}
        />
      }
      headerAction={
        <Button
          onClick={() => setShowContactModal(true)}
          className="hidden md:inline-flex h-8 px-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Request Quote
        </Button>
      }
      gallery={
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
      }
      info={
        <div className="space-y-10">
          <ServiceHeader
            service={service}
            isInWishlist={isInWishlist}
            onToggleWishlist={handleToggleWishlist}
            onInquire={() => setShowContactModal(true)}
          />
          <ServiceInfo
            service={service}
            onInquire={() => setShowContactModal(true)}
          />

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
        </div>
      }
      tabs={
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
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <TabsContent value="overview">
              <ServiceTabsContent
                service={service}
                activeTab="overview"
                trackAndNavigate={trackAndNavigate as never}
              />
            </TabsContent>
            <TabsContent value="products">
              <ServiceTabsContent
                service={service}
                activeTab="products"
                trackAndNavigate={trackAndNavigate as never}
              />
            </TabsContent>
            <TabsContent value="reviews">
              <ServiceTabsContent
                service={service}
                activeTab="reviews"
                trackAndNavigate={trackAndNavigate as never}
              />
            </TabsContent>
            <TabsContent value="contact">
              <ServiceTabsContent
                service={service}
                activeTab="contact"
                trackAndNavigate={trackAndNavigate as never}
              />
            </TabsContent>
          </div>
        </Tabs>
      }
      sidebar={
        <div className="pt-2">
          <ServiceSidebar
            service={service}
            onViewBio={() =>
              router.navigate({ to: `/suppliers/${service.company?.id}` })
            }
          />
        </div>
      }
      modals={
        <ResourceInquiryModal
          isOpen={showContactModal}
          onOpenChange={setShowContactModal}
          onSubmit={handleSubmitInquiry}
          resourceName={service.name}
          resourceType="SERVICE"
          isLoading={sendingInquiry}
        />
      }
    />
  );
}
