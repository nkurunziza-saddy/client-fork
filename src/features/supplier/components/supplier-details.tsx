import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useSupplierActions } from "@/hooks/use-supplier-actions";
import { useGetCompanyByIdQuery } from "@/services/api/companies";
import { useGetProductsQuery } from "@/services/api/products";
import type { Product } from "@/types";
import { Building2 } from "lucide-react";
import { SupplierActions } from "./details/supplier-actions";
import { SupplierContactModal } from "./details/supplier-contact-modal";
import { SupplierHeader } from "./details/supplier-header";
import { SupplierTabsContent } from "./details/supplier-tabs-content";
import { DetailPageSkeleton } from "@/shared/components/skeletons";
import { RiArrowLeftLine } from "@remixicon/react";

type SupplierItem = Product;

interface SupplierDetailsProps {
  supplierId: string;
  onBack: () => void;
  onProductClick: (item: SupplierItem) => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
  supplierId,
  onBack,
  onProductClick,
}) => {
  const {
    data: company,
    isLoading,
    error,
  } = useGetCompanyByIdQuery(supplierId);
  const { data: listingsData } = useGetProductsQuery({ companyId: supplierId });
  const listings = listingsData?.data || [];
  const featuredListings = listings.slice(0, 4);

  const {
    showContactModal,
    setShowContactModal,
    handleOpenContactModal,
    handleSubmitInquiry,
    sendingInquiry,
  } = useSupplierActions(company);

  const rating = Number(company?.averageRating ?? 0);
  const location =
    [company?.district, company?.province].filter(Boolean).join(", ") ||
    "Kigali, Rwanda";

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !company) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Empty className="max-w-md w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 className="w-4 h-4 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-display font-black uppercase">
              Supplier Not Found
            </EmptyTitle>
            <EmptyDescription className="uppercase tracking-widest text-[10px]">
              The supplier you are looking for may have been removed or does not
              exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={onBack}
              className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
            >
              Back to Directory
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background space-y-0 overflow-x-hidden industrial-grain pb-24">
      <SupplierContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleSubmitInquiry}
        company={company}
        sendingInquiry={sendingInquiry}
      />

      <SupplierActions
        company={company}
        onContactClick={handleOpenContactModal}
        isMobile
      />

      {/* Top Navigation */}
      <div className="bg-background border-b border-border/40 py-3 md:py-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              className="shrink-0"
            >
              <RiArrowLeftLine className="size-4" />
            </Button>
            <div className="h-4 w-px bg-border/60 shrink-0" />
            <h1 className="font-display font-black uppercase text-xs md:text-sm tracking-widest truncate text-foreground">
              {company.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleOpenContactModal}
              className="hidden md:inline-flex h-8 px-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Contact Supplier
            </Button>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase hidden sm:block">
              {company.isVerified ? "Verified Provider" : "Supplier"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-8 md:pb-12 space-y-12">
        <SupplierHeader
          company={company}
          rating={rating}
          location={location}
          onContactClick={handleOpenContactModal}
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-2 md:pt-4">
          <div className="lg:col-span-8 space-y-12">
            <SupplierTabsContent
              company={company}
              listings={listings}
              onProductClick={onProductClick}
              featuredListings={featuredListings}
            />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="hidden md:block">
              <SupplierActions
                company={company}
                onContactClick={handleOpenContactModal}
              />
            </div>

            {/* Contact Info Card */}
            <div className="rounded-none border border-border/40 bg-muted/10 p-8 relative overflow-hidden">
              <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-3">
                Supplier Contact
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="text-xs font-bold">{location}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Joined
                  </p>
                  <p className="text-xs font-bold">
                    {company.createdAt
                      ? new Date(company.createdAt).getFullYear()
                      : "2024"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
