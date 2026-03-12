import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/components/reset-password-page";

export const Route = createFileRoute("/auth/reset-password")({
	component: ResetPasswordPage,
});
