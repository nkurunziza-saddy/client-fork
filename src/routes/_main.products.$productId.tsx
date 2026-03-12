import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailsPage } from "@/features/marketplace/components/product-details-page";
import { productsApi } from "@/services/api/products";
import { store } from "@/store";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/products/$productId")({
	component: ProductDetailsPage,
	loader: async ({ params }) => {
		const result = await store.dispatch(
			productsApi.endpoints.getProductById.initiate(params.productId),
		);
		return result.data;
	},
	head: async ({ loaderData }) => {
		const data = await loaderData;
		if (!data) return createSeoMeta({ title: "Product Details" });

		return createSeoMeta({
			title: data.name,
			description:
				data.description ||
				`Buy ${data.name} wholesale at AfrikaMarket. High-quality products from trusted African suppliers.`,
			image: data.images?.[0] || "/enhanced_gpt.png",
			type: "product",
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "Product",
				name: data.name,
				description: data.description,
				image: data.images,
				offers: {
					"@type": "Offer",
					price: data.price,
					priceCurrency: "USD", // Adjust if needed
					availability: "https://schema.org/InStock",
				},
			},
		});
	},
});
