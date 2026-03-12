import { createFileRoute } from "@tanstack/react-router";
import { SupplierDetailsPage } from "@/features/supplier/components/supplier-details-page";
import { companiesApi } from "@/services/api/companies";
import { store } from "@/store";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/suppliers/$supplierId")({
	component: SupplierDetailsPage,
	loader: async ({ params }) => {
		const result = await store.dispatch(
			companiesApi.endpoints.getCompanyById.initiate(params.supplierId),
		);
		return result.data;
	},
	head: async ({ loaderData }) => {
		const data = await loaderData;
		if (!data) return createSeoMeta({ title: "Supplier Details" });

		return createSeoMeta({
			title: data.name,
			description:
				data.description ||
				`Connect with ${data.name} on AfrikaMarket. Verified wholesale supplier of ${data.category?.name || "quality products"} in ${data.district || "Africa"}.`,
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
					addressCountry: "RW", // Adjust as needed
				},
			},
		});
	},
});
