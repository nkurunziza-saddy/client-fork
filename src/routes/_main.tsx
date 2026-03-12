import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/main-layout";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main")({
	component: MainLayout,
	head: () =>
		createSeoMeta({
			title: "African Wholesale Hub",
			description:
				"AfrikaMarket - The leading B2B marketplace for African wholesale commerce. Connect with verified suppliers and retailers.",
		}),
});
