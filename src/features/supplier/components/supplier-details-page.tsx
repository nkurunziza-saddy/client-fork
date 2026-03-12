import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { PageContainer } from "@/shared/components";
import { ROUTES } from "@/shared/constants/routes";
import type { Product } from "@/types";
import SupplierDetails from "./supplier-details";

export function SupplierDetailsPage() {
	const navigate = useNavigate();
	const { supplierId } = useParams({ from: "/_main/suppliers/$supplierId" });

	const handleBack = useCallback(() => {
		navigate({ to: ROUTES.PUBLIC.SUPPLIERS });
	}, [navigate]);

	const handleProductClick = useCallback(
		(product: Product) => {
			navigate({
				to: "/products/$productId",
				params: { productId: product.id },
			});
		},
		[navigate],
	);

	if (!supplierId) {
		return (
			<PageContainer>
				<div className="text-center py-20 border border-dashed border-border/40">
					<h2 className="text-2xl font-display font-black uppercase text-foreground mb-4 tracking-tight">
						Supplier Not Found
					</h2>
					<button
						onClick={handleBack}
						className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline"
					>
						Back to Directory
					</button>
				</div>
			</PageContainer>
		);
	}

	return (
		<SupplierDetails
			supplierId={supplierId}
			onBack={handleBack}
			onProductClick={handleProductClick}
		/>
	);
}
