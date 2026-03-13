import { useNavigate, useParams } from "@tanstack/react-router";
import ProductView from "@/features/marketplace/components/product-view";

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/_main/products/$productId" });

  return (
    <ProductView
      productId={productId || ""}
      onBack={() => navigate({ to: "/products" })}
      onSupplierClick={(supplierId: string) =>
        navigate({ to: "/suppliers/$supplierId", params: { supplierId } })
      }
    />
  );
}
