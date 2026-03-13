import { useRouter } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductActions } from "@/hooks/use-product-actions";
import { useGetProductByIdQuery } from "@/services/api/products";
import { DetailsPageLayout } from "@/shared/components/layouts/details-page-layout";
import { ResourceInquiryModal } from "@/shared/components/modals/resource-inquiry-modal";
import { DetailPageSkeleton } from "@/shared/components/skeletons";
import { MobileActions } from "./product/mobile-actions";
import { ProductGallery } from "./product/product-gallery";
import { ProductInfo } from "./product/product-info";
import { ProductSidebar } from "./product/product-sidebar";
import { ProductTabsContent } from "./product/product-tabs-content";

interface ProductViewProps {
  productId: string;
  onBack?: () => void;
  onSupplierClick?: (supplierId: string) => void;
}

export default function ProductView({
  productId,
  onBack,
  onSupplierClick,
}: ProductViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useGetProductByIdQuery(productId);

  const {
    messageOpen: showContactModal,
    setMessageOpen: setShowContactModal,
    isInWishlist,
    handleToggleWishlist,
    trackAndNavigate,
    handleSubmitInquiry,
  } = useProductActions(productId);

  const handleBack = useCallback(() => {
    router.history.back();
  }, [router.history]);

  const images = useMemo(() => {
    if (!product) return [];
    if (product.variants?.length) {
      const vImgs = product.variants.flatMap((v) => v.images || []);
      if (vImgs.length > 0) return vImgs;
    }
    return product.images || [];
  }, [product]);

  const keyFacts = useMemo(() => {
    if (!product) return [];
    const facts = [
      { label: "ID", value: product.id },
      { label: "Category", value: product.category?.name || "General" },
    ];
    const sku = product.variants?.[0]?.sku || product.id.substring(0, 8);
    if (sku) facts.push({ label: "SKU", value: sku });
    return facts;
  }, [product]);

  const backHandler = onBack || handleBack;

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!product)
    return (
      <Empty className="max-w-md w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 className="w-4 h-4 text-primary" />
          </EmptyMedia>
          <EmptyTitle className="text-xl font-display font-black uppercase">
            Product not found
          </EmptyTitle>
          <EmptyDescription className="uppercase tracking-widest text-[10px]">
            We couldn't find this product
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={backHandler}
            className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
          >
            Go Back
          </Button>
        </EmptyContent>
      </Empty>
    );

  const primaryVariant = product.variants?.[0];

  return (
    <DetailsPageLayout
      title={product.name}
      badgeText={product.category?.name || "Product"}
      onBack={backHandler}
      mobileActions={
        <MobileActions
          productName={product.name}
          phone={product.company?.phone}
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
          Order Inquiry
        </Button>
      }
      gallery={
        <ProductGallery
          images={images}
          name={product.name}
          selectedImageIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
        />
      }
      info={
        <ProductInfo
          name={product.name}
          description={product.description}
          price={primaryVariant?.price ?? 0}
          priceType={product.priceType}
          stock={primaryVariant?.stock ?? 0}
          views={product.views}
          onInquire={() => setShowContactModal(true)}
        />
      }
      tabs={
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">
              Product Details
            </h2>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-border/40 h-auto p-0 gap-8">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            <div className="mt-8">
              <ProductTabsContent
                description={product.description || ""}
                keyFacts={keyFacts}
                variantName={primaryVariant?.name}
                variantSku={primaryVariant?.sku}
              />
            </div>
          </Tabs>
        </div>
      }
      sidebar={
        <ProductSidebar
          company={product.company}
          productName={product.name}
          onSupplierClick={onSupplierClick || (() => {})}
        />
      }
      modals={
        <ResourceInquiryModal
          isOpen={showContactModal}
          onOpenChange={setShowContactModal}
          onSubmit={handleSubmitInquiry}
          resourceName={product.name}
          resourceType="PRODUCT"
        />
      }
    />
  );
}
