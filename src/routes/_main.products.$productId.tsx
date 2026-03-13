import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailsPage } from "@/features/marketplace/components/product-details-page";
import { productsApi } from "@/services/api/products";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";
import { createSeoMeta } from "@/shared/utils/seo";
import { store } from "@/store";

export const Route = createFileRoute("/_main/products/$productId")({
	staleTime: 60_000,
	gcTime: 300_000,
	component: ProductDetailsPage,
	pendingComponent: RouteLoading,
	errorComponent: RouteError,
	notFoundComponent: NotFound,
	loader: async ({ params }) => {
		const result = await store.dispatch(
			productsApi.endpoints.getProductById.initiate(params.productId),
		);
		if (!result.data) throw new Error("Product not found");
		return result.data;
	},
	head: async ({ loaderData }) => {
		const data = await loaderData;
		if (!data) return createSeoMeta({ title: "Product Details" });

		return createSeoMeta({
			title: data.name,
			description:
				data.description ||
				`Buy ${data.name} wholesale at Karibu. High-quality products from trusted African suppliers.`,
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
