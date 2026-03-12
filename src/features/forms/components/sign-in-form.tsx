import {
	RiArrowRightLine,
	RiEyeLine,
	RiEyeOffLine,
	RiLockLine,
	RiMailLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";

interface SignInFormProps {
	onSubmit: (data: { email: string; password?: string }) => void;
	isLoading?: boolean;
	serverError?: string;
	showResendVerification?: boolean;
	onResendVerification?: () => void;
	isResending?: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
	onSubmit,
	isLoading = false,
	serverError,
	showResendVerification,
	onResendVerification,
	isResending,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="w-full space-y-6"
		>
			{serverError && (
				<Alert
					variant="destructive"
					className="rounded-none border-destructive/20 bg-destructive/5"
				>
					<AlertDescription className="font-bold uppercase tracking-widest text-[10px]">
						{serverError}
					</AlertDescription>
					<div className="flex justify-start">
						{showResendVerification && (
							<button
								type="button"
								onClick={onResendVerification}
								disabled={isResending}
								className="mt-2 text-[10px] font-black uppercase tracking-widest text-destructive underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-40"
							>
								{isResending ? "Sending..." : "Resend Verification Email"}
							</button>
						)}
					</div>
				</Alert>
			)}

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

			<form.Field name="password">
				{(field) => (
					<FormField
						label="Password"
						required
						headerActions={
							<Link
								to="/auth/forgot-password"
								className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
							>
								Forgot?
							</Link>
						}
					>
						<div className="relative">
							<RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								className="pl-10 h-12 shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							>
								{showPassword ? (
									<RiEyeOffLine className="w-4 h-4" />
								) : (
									<RiEyeLine className="w-4 h-4" />
								)}
							</button>
						</div>
					</FormField>
				)}
			</form.Field>

			<Button
				type="submit"
				className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 border-none rounded-none"
				disabled={isLoading}
			>
				{isLoading ? "Signing In..." : "Sign In"}
				{!isLoading && <RiArrowRightLine className="ml-2 w-4 h-4" />}
			</Button>
		</form>
	);
};
