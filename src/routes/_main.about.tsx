import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/features/home/components/about-page";
import { createSeoMeta } from "@/shared/utils/seo";

export const Route = createFileRoute("/_main/about")({
  component: AboutPage,
  head: () =>
    createSeoMeta({
      title: "About Us",
      description:
        "Learn more about Karibu, our mission to empower African wholesale commerce, and how we connect retailers with verified suppliers.",
    }),
});
