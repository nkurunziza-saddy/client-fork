import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CategoriesPage from "@/features/marketplace/components/categories-page";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/categories")({
  component: CategoriesPageWrapper,
  head: () =>
    createSeoMeta({
      title: "Product Categories",
      description:
        "Explore wholesale product categories on Karibu. From electronics to agriculture, find the best African suppliers in every industry.",
    }),
});

function CategoriesPageWrapper() {
  const navigate = useNavigate();

  return (
    <CategoriesPage
      onBack={() => navigate({ to: "/" })}
      onSupplierClick={(supplierId: string) =>
        navigate({
          to: "/suppliers/$supplierId",
          params: { supplierId },
        })
      }
    />
  );
}
