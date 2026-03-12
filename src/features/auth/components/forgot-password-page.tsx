import { RiArrowLeftLine, RiMailLine } from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgetPasswordMutation } from "@/services/api/auth";
import { FormField } from "@/shared/components";

export function ForgotPasswordPage() {
	const [sent, setSent] = useState(false);
	const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

	const form = useForm({
		defaultValues: { email: "" },
		onSubmit: async ({ value }) => {
			try {
				await forgetPassword({
					email: value.email,
					redirectTo: `${window.location.origin}/auth/reset-password`,
				}).unwrap();
				setSent(true);
			} catch {
				toast.error("Could not send reset email. Please try again.");
			}
		},
	});

	return (
		<>
			<Link
				to="/auth/signin"
				className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
			>
				<RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
				<span className="text-xs font-heading font-bold uppercase tracking-wider">
					Back to Sign In
				</span>
			</Link>

			<div className="mb-10">
				<h2 className="text-3xl font-heading font-bold uppercase mb-2 text-foreground">
					Forgot Password
				</h2>
				<p className="text-muted-foreground">
					Enter your email and we'll send you a reset link.
				</p>
			</div>

			{sent ? (
				<Alert className="rounded-none border-primary/20 bg-primary/5">
					<AlertDescription className="font-bold uppercase tracking-widest text-[10px] text-primary">
						Check your inbox — a reset link has been sent to your email.
					</AlertDescription>
				</Alert>
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="w-full space-y-6"
				>
					<form.Field name="email">
						{(field) => (
							<FormField label="Email Address" required>
								<div className="relative">
									<RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="email"
										placeholder="name@company.com"
										className="pl-10 h-12 shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
										required
									/>
								</div>
							</FormField>
						)}
					</form.Field>

					<Button
						type="submit"
						className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 border-none rounded-none"
						disabled={isLoading}
					>
						{isLoading ? "Sending..." : "Send Reset Link"}
					</Button>
				</form>
			)}
		</>
	);
}
