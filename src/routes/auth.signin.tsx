import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignInPage } from "@/features/auth/components/sign-in-page";
import { NotFound } from "@/shared/components/not-found";
import { RouteError } from "@/shared/components/route-error";
import { RouteLoading } from "@/shared/components/route-loading";

export const Route = createFileRoute("/auth/signin")({
	validateSearch: z.object({
		from: z.string().optional().default("/"),
	}),
	component: SignInPage,
	pendingComponent: RouteLoading,
	notFoundComponent: NotFound,
	errorComponent: RouteError,
});
