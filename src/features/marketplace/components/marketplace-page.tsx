import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import MarketplaceGrid from "@/features/marketplace/components/marketplace-grid";
import type { MarketplaceItem } from "@/types";

export function MarketplacePage({
  forcedType,
  from,
}: {
  forcedType?: "PRODUCT" | "SERVICE";
  from: "/_main/products/" | "/_main/services/";
}) {
  const navigate = useNavigate();

  const handleProductClick = useCallback(
    (listing: MarketplaceItem) => {
      if (listing.itemType === "SERVICE") {
        navigate({
          to: "/services/$serviceId",
          params: { serviceId: listing.id },
        });
        return;
      }

      navigate({
        to: "/products/$productId",
        params: { productId: listing.id },
      });
    },
    [navigate],
  );

  const handleSupplierClick = useCallback(
    (supplierId: string) => {
      navigate({
        to: "/suppliers/$supplierId",
        params: { supplierId },
      });
    },
    [navigate],
  );

  return (
    <MarketplaceGrid
      onSupplierClick={handleSupplierClick}
      onProductClick={handleProductClick}
      forcedType={forcedType}
      from={from}
    />
  );
}
