import { createFileRoute } from "@tanstack/react-router";
import { SupplierDetailsPage } from "@/features/supplier/components/supplier-details-page";
import { companiesApi } from "@/services/api/companies";
import { store } from "@/store";
import { createSeoMeta } from "@/shared/utils/seo";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { NotFound } from "@/shared/components/not-found";

export const Route = createFileRoute("/_main/suppliers/$supplierId")({
  staleTime: 120_000,
  gcTime: 600_000,
  component: SupplierDetailsPage,
  pendingComponent: RouteLoading,
  errorComponent: RouteError,
  notFoundComponent: NotFound,
  loader: async ({ params }) => {
    const result = await store.dispatch(
      companiesApi.endpoints.getCompanyById.initiate(params.supplierId),
    );
    if (!result.data) throw new Error("Supplier not found");
    return result.data;
  },
  head: async ({ loaderData }) => {
    const data = await loaderData;
    if (!data) return createSeoMeta({ title: "Supplier Details" });

    return createSeoMeta({
      title: data.name,
      description:
        data.description ||
        `Connect with ${data.name} on Karibu. Verified wholesale supplier of ${data.category?.name || "quality products"} in ${data.district || "Africa"}.`,
      image: data.logoUrl || "/enhanced_gpt.png",
      type: "profile",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: data.name,
        description: data.description,
        image: data.logoUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: data.district,
          addressRegion: data.province,
          addressCountry: "RW",
        },
      },
    });
  },
});
