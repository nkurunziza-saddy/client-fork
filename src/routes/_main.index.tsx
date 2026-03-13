import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/home/components/home-page";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/")({
  component: HomePage,
  head: () =>
    createSeoMeta({
      title: "Wholesale Marketplace for African Suppliers",
      description:
        "Discover and connect with trusted African wholesale suppliers. Karibu is the premier B2B marketplace for quality products from across the continent.",
      keywords: [
        "African wholesale",
        "B2B marketplace Africa",
        "African suppliers",
        "wholesale products Africa",
        "Karibu",
      ],
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Karibu",
        url: "https://afri-market-rep.vercel.app",
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://afri-market-rep.vercel.app/products?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    }),
});
