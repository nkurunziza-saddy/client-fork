import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/features/auth/components/sign-in-page";

export const Route = createFileRoute("/auth/signin")({
	validateSearch: (search: Record<string, unknown>): { from?: string } => {
		return {
			from: (search.from as string) || undefined,
		};
	},
	component: SignInPage,
});
