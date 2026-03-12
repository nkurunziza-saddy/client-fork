import { createFileRoute } from "@tanstack/react-router";
import { SuppliersPage } from "@/features/supplier/components/suppliers-page";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/suppliers/")({
	component: SuppliersPage,
	head: () =>
		createSeoMeta({
			title: "Verified African Wholesale Suppliers",
			description:
				"Connect with verified wholesale suppliers and importers across Africa. Expand your business with reliable partners and quality products.",
			keywords: [
				"African wholesale suppliers",
				"African importers",
				"wholesale distributors Africa",
				"verified suppliers Africa",
			],
		}),
});
