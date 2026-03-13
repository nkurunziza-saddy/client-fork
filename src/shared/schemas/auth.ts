import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signInOptions = formOptions({
	defaultValues: {
		email: "",
		password: "",
	} as SignInFormValues,
	validators: {
		onChange: signInSchema,
	},
});

export const signUpSchema = z
	.object({
		name: z.string().min(2, "Full name must be at least 2 characters"),
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signUpOptions = formOptions({
	defaultValues: {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	} as SignUpFormValues,
	validators: {
		onChange: signUpSchema,
	},
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordOptions = formOptions({
	defaultValues: {
		email: "",
	} as ForgotPasswordFormValues,
	validators: {
		onChange: forgotPasswordSchema,
	},
});

export const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Confirm password is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordOptions = formOptions({
	defaultValues: {
		newPassword: "",
		confirmPassword: "",
	} as ResetPasswordFormValues,
	validators: {
		onChange: resetPasswordSchema,
	},
});

export const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	phoneNumber: z.string().optional(),
	image: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileOptions = formOptions({
	defaultValues: {
		name: "",
		phoneNumber: "",
		image: "",
	} as ProfileFormValues,
	validators: {
		onChange: profileSchema,
	},
});
