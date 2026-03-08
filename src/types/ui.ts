import type { Product, Service } from "./models";

export interface SupplierRow {
	id: string;
	name: string;
	type: string;
	district: string;
	rating: number;
	status: "active" | "suspended" | "pending";
	isVerified: boolean;
}

export interface ProductRow {
	id: string;
	name: string;
	category: string;
	supplier: string;
	supplierId: string;
	status: "active" | "inactive";
	createdDate: string;
	views: number;
}

export interface ServiceRow {
	id: string;
	name: string;
	category: string;
	supplier: string;
	supplierId: string;
	status: "active" | "inactive";
	createdDate: string;
	views: number;
}

export interface CustomerRow {
	id: string;
	name: string;
	location: string;
	joinDate: string;
	status: "active" | "inactive";
	visits: number;
	rating: number;
}

export interface AssignmentRow {
	id: string;
	supplier: string;
	service: string;
	assignedDate: string;
	status: "active" | "inactive";
	price: number;
	supplierId: string;
}

export type ListingType = "all" | "PRODUCT" | "SERVICE";

export type MarketplaceItem =
	| (Product & { itemType: "PRODUCT" })
	| (Service & { itemType: "SERVICE" });

export interface CatalogFilters {
	searchQuery: string;
	categoryId: string;
	type: ListingType;
	district: string;
	minPrice: string;
	maxPrice: string;
	onlyInStock: boolean;
	companyType: string;
	sortBy: string;
	sortOrder: "ASC" | "DESC";
	page: number;
}

export interface SupplierFiltersState {
	searchQuery: string;
	categoryId: string;
	district: string;
	type: string;
	minRating: string;
	verified: boolean;
	page: number;
}

export type DashboardTab =
	| "overview"
	| "products"
	| "inquiries"
	| "messages"
	| "analytics"
	| "settings";

export interface NavHeaderInfo {
	name: string;
	logo?: React.ElementType;
	logoUrl?: string;
	plan: string;
}

export interface PageHeaderProps {
	title: string;
	subtitle?: string;
	badge?: string;
	actions?: React.ReactNode;
	showPattern?: boolean;
	dark?: boolean;
	className?: string;
}

export interface HeroWidgetItem {
	id: string;
	image?: string;
	price?: number | string;
	name?: string;
	label?: string;
	subtitle?: string;
	stat?: string;
	statDesc?: string;
	subtext?: string;
	rating?: number;
	type?: "product" | "supplier" | "service" | "stat";
}

export type FileMetadata = {
	name: string;
	size: number;
	type: string;
	url: string;
	id: string;
};

export type FileWithPreview = {
	file: File | FileMetadata;
	id: string;
	preview?: string;
};

export type FileUploadOptions = {
	maxFiles?: number;
	maxSize?: number;
	accept?: string;
	multiple?: boolean;
	initialFiles?: FileMetadata[];
	onFilesChange?: (files: FileWithPreview[]) => void;
	onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
};

export type FileUploadState = {
	files: FileWithPreview[];
	isDragging: boolean;
	errors: string[];
};

export type FileUploadActions = {
	addFiles: (files: FileList | File[]) => void;
	removeFile: (id: string) => void;
	clearFiles: () => void;
	clearErrors: () => void;
	handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
	handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
	handleDrop: (e: React.DragEvent<HTMLElement>) => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	openFileDialog: () => void;
	getInputProps: (
		props?: React.InputHTMLAttributes<HTMLInputElement>,
	) => React.InputHTMLAttributes<HTMLInputElement>;
};
