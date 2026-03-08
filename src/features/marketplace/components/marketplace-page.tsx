import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import MarketplaceGrid from "@/features/marketplace/components/marketplace-grid";
import { ROUTES } from "@/shared/constants/routes";
import type { MarketplaceItem } from "@/types";

export function MarketplacePage({
	forcedType,
}: {
	forcedType?: "PRODUCT" | "SERVICE";
}) {
	const navigate = useNavigate();

	const handleProductClick = useCallback(
		(listing: MarketplaceItem) => {
			if (listing.itemType === "SERVICE") {
				navigate({
					to: ROUTES.PUBLIC.SERVICE(listing.id) as any,
				});
				return;
			}

			navigate({
				to: ROUTES.PUBLIC.PRODUCT(listing.id) as any,
			});
		},
		[navigate],
	);

	const handleSupplierClick = useCallback(
		(supplierId: string) => {
			navigate({
				to: ROUTES.PUBLIC.SUPPLIER(supplierId) as any,
			});
		},
		[navigate],
	);

	return (
		<MarketplaceGrid
			onSupplierClick={handleSupplierClick}
			onProductClick={handleProductClick}
			forcedType={forcedType}
		/>
	);
}
