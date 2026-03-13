import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const productSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	categoryId: z.string().min(1, "Please select a category"),
	description: z.string().catch(""),
	price: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
			message: "Price must be a positive number",
		}),
	priceType: z.enum(["FIXED", "NEGOTIABLE", "STARTS_AT"]),
	stock: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
			message: "Stock must be a non-negative number",
		}),
	unit: z.string().min(1, "Unit is required"),
	imageUrls: z.array(z.string()).catch([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const productOptions = formOptions({
	defaultValues: {
		name: "",
		categoryId: "",
		description: "",
		price: "0",
		priceType: "FIXED",
		stock: "0",
		unit: "unit",
		imageUrls: [],
	} as ProductFormValues,
	validators: {
		onChange: productSchema,
	},
});

export const serviceSchema = z.object({
	name: z.string().min(2, "Service name must be at least 2 characters"),
	categoryId: z.string().min(1, "Please select a category"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	price: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
			message: "Rate must be a positive number",
		}),
	priceType: z.enum(["FIXED", "NEGOTIABLE", "STARTS_AT"]),
	duration: z.string().min(1, "Duration is required"),
	discount: z
		.string()
		.refine(
			(val) =>
				!Number.isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
			{
				message: "Discount must be between 0 and 100",
			},
		),
	imageUrls: z.array(z.string()).catch([]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const serviceOptions = formOptions({
	defaultValues: {
		name: "",
		categoryId: "",
		description: "",
		price: "0",
		priceType: "FIXED",
		duration: "",
		discount: "0",
		imageUrls: [],
	} as ServiceFormValues,
	validators: {
		onChange: serviceSchema,
	},
});

export const auctionSchema = z
	.object({
		title: z.string().min(3, "Title must be at least 3 characters"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters"),
		startingPrice: z
			.string()
			.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
				message: "Starting price must be a positive number",
			}),
		startDate: z.string().min(1, "Start date is required"),
		endDate: z.string().min(1, "End date is required"),
		imageUrls: z.array(z.string()).catch([]),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate).getTime();
			const end = new Date(data.endDate).getTime();
			return end > start;
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		},
	);

export type AuctionFormValues = z.infer<typeof auctionSchema>;

export const auctionOptions = formOptions({
	defaultValues: {
		title: "",
		description: "",
		startingPrice: "",
		startDate: "",
		endDate: "",
		imageUrls: [],
	} as AuctionFormValues,
	validators: {
		onChange: auctionSchema,
	},
});

export const categorySchema = z.object({
	name: z.string().min(2, "Category name must be at least 2 characters"),
	description: z.string().min(5, "Description must be at least 5 characters"),
	icon: z.string().catch(""),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const categoryOptions = formOptions({
	defaultValues: {
		name: "",
		description: "",
		icon: "",
	} as CategoryFormValues,
	validators: {
		onChange: categorySchema,
	},
});

export const companySetupSchema = z.object({
	name: z.string().min(2, "Company name must be at least 2 characters"),
	slug: z
		.string()
		.min(3, "Slug must be at least 3 characters")
		.regex(
			/^[a-z0-0-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens",
		),
	categoryId: z.string().min(1, "Please select a category"),
	companyType: z.string().min(1, "Please select a company type"),
	province: z.string().min(1, "Province is required"),
	district: z.string().min(1, "District is required"),
	sector: z.string().min(1, "Sector is required"),
	cell: z.string().min(1, "Cell is required"),
	village: z.string().min(1, "Village is required"),
	description: z.string().catch(""),
});

export type CompanySetupFormValues = z.infer<typeof companySetupSchema>;

export const companySetupOptions = formOptions({
	defaultValues: {
		name: "",
		slug: "",
		categoryId: "",
		companyType: "SUPPLIER_RETAILER",
		province: "",
		district: "",
		sector: "",
		cell: "",
		village: "",
		description: "",
	} as CompanySetupFormValues,
	validators: {
		onChange: companySetupSchema,
	},
});

export const supplierProvisionSchema = z.object({
	companyName: z.string().min(2, "Company name must be at least 2 characters"),
	industry: z.string().min(1, "Please select an industry"),
	registrationId: z.string().min(1, "Registration ID is required"),
	location: z.string().min(1, "Province is required"),
	district: z.string().min(1, "District is required"),
	sectorAddress: z.string().catch(""),
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	phoneNumber: z
		.string()
		.min(10, "Phone number must be at least 10 characters"),
	position: z.string().min(1, "Job title is required"),
	nationalId: z.string().catch(""),
});

export type SupplierProvisionValues = z.infer<typeof supplierProvisionSchema>;

export const supplierProvisionOptions = formOptions({
	defaultValues: {
		companyName: "",
		industry: "",
		registrationId: "",
		location: "",
		district: "",
		sectorAddress: "",
		fullName: "",
		email: "",
		phoneNumber: "",
		position: "",
		nationalId: "",
	} as SupplierProvisionValues,
	validators: {
		onChange: supplierProvisionSchema,
	},
});

export const variantSchema = z.object({
	name: z.string().min(1, "Name is required"),
	price: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
			message: "Price must be a positive number",
		}),
	stock: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
			message: "Stock must be a non-negative number",
		}),
	unit: z.string().catch(""),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

export const variantOptions = formOptions({
	defaultValues: {
		name: "",
		price: "",
		stock: "",
		unit: "",
	} as VariantFormValues,
	validators: {
		onChange: variantSchema,
	},
});

export const reviewSchema = z.object({
	rating: z.number().min(1, "Please select a rating").max(5),
	comment: z.string().min(10, "Review must be at least 10 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const reviewOptions = formOptions({
	defaultValues: {
		rating: 5,
		comment: "",
	} as ReviewFormValues,
	validators: {
		onChange: reviewSchema,
	},
});

export const contactSchema = z.object({
	message: z.string().min(10, "Please enter at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactOptions = formOptions({
	defaultValues: {
		message: "",
	} as ContactFormValues,
	validators: {
		onChange: contactSchema,
	},
});
