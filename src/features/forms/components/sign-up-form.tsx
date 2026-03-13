import {
	RiArrowRightLine,
	RiEyeLine,
	RiEyeOffLine,
	RiLockLine,
	RiMailLine,
	RiUserLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { useLazyCheckEmailQuery } from "@/services/api/users";
import { FormField } from "@/shared/components";
import { signUpSchema } from "@/shared/schemas/auth";

interface SignUpFormProps {
	role: "user" | "provider";
	onSubmit: (data: {
		name: string;
		email: string;
		password?: string;
		role: "user" | "provider";
	}) => void;
	isLoading?: boolean;
	serverError?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
	role,
	onSubmit,
	isLoading = false,
	serverError,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [checkEmail] = useLazyCheckEmailQuery();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit({
				name: value.name,
				email: value.email,
				password: value.password,
				role,
			});
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
			<form.Subscribe
				selector={(state) => state.errors}
				children={(errors) => {
					const formError = errors.length > 0 ? errors[0]?.toString() : null;
					return (
						(serverError || formError) && (
							<Alert
								variant="destructive"
								className="rounded-none border-destructive/20 bg-destructive/5"
							>
								<AlertDescription className="font-bold uppercase tracking-widest text-[10px]">
									{serverError || formError}
								</AlertDescription>
							</Alert>
						)
					);
				}}
			/>

			<div className="space-y-4">
				<form.Field
					name="name"
					children={(field) => (
						<FormField
							label="Full Name"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<div className="relative group">
								<RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="text"
									className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
									placeholder="John Doe"
								/>
							</div>
						</FormField>
					)}
				/>

				<form.Field
					name="email"
					asyncDebounceMs={500}
					validators={{
						onChangeAsync: async ({ value }: { value: string }) => {
							if (!value || !value.includes("@")) return undefined;
							try {
								const res = await checkEmail(value).unwrap();
								if (!res.available) return "Email is already registered";
								return undefined;
							} catch {
								return undefined;
							}
						},
					}}
					children={(field) => (
						<FormField
							label="Email Address"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<div className="relative group">
								<RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="email"
									className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
									placeholder="name@company.com"
								/>
								{field.state.meta.isValidating && (
									<div className="absolute right-4 top-1/2 -translate-y-1/2">
										<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
									</div>
								)}
							</div>
						</FormField>
					)}
				/>

				<form.Field
					name="password"
					children={(field) => (
						<FormField
							label="Password"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<div className="relative group">
								<RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type={showPassword ? "text" : "password"}
									className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
									placeholder="Min 8 characters"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
								>
									{showPassword ? (
										<RiEyeOffLine className="w-5 h-5" />
									) : (
										<RiEyeLine className="w-5 h-5" />
									)}
								</button>
							</div>
						</FormField>
					)}
				/>

				<form.Field
					name="confirmPassword"
					children={(field) => (
						<FormField
							label="Confirm Password"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<div className="relative group">
								<RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type={showConfirmPassword ? "text" : "password"}
									className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
								>
									{showConfirmPassword ? (
										<RiEyeOffLine className="w-5 h-5" />
									) : (
										<RiEyeLine className="w-5 h-5" />
									)}
								</button>
							</div>
						</FormField>
					)}
				/>
			</div>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						disabled={!canSubmit || isLoading || isSubmitting}
						className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] rounded-none border-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
					>
						{isLoading || isSubmitting
							? "Creating Account..."
							: "Create Account"}
						{!isLoading && !isSubmitting && (
							<RiArrowRightLine className="ml-2 w-5 h-5" />
						)}
					</Button>
				)}
			/>
		</form>
	);
};
