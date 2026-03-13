import type { Company, HeroWidgetItem, Product, Service } from "@/types";
import { formatCurrency } from "./format";

export interface HeroFeaturedProduct {
	id: string;
	name: string;
	image?: string;
	category: string;
	price: string;
	originalPrice?: string;
	discount?: string;
	supplier: string;
	rating: number;
	reviews: number;
	tag: string;
}

const getProductPrimaryVariant = (product: Product) => product.variants?.[0];

export const mapProductToHeroFeaturedProduct = (
	product: Product,
): HeroFeaturedProduct => {
	const variant = getProductPrimaryVariant(product);
	const basePrice = Number(variant?.price ?? 0);
	const discountPercent = Number(variant?.discount ?? 0);
	const discountedPrice =
		discountPercent > 0
			? Math.max(Math.round(basePrice * (1 - discountPercent / 100)), 0)
			: basePrice;
	const supplierRating = Number(product.company?.rating ?? 0);

	return {
		id: product.id,
		name: product.name,
		image: variant?.images?.[0],
		category: product.category?.name || "General",
		price: formatCurrency(discountedPrice, "RWF"),
		originalPrice:
			discountPercent > 0 && basePrice > 0
				? formatCurrency(basePrice, "RWF")
				: undefined,
		discount:
			discountPercent > 0 ? `-${Math.round(discountPercent)}%` : undefined,
		supplier: product.company?.name || "Unknown Supplier",
		rating: Number.isFinite(supplierRating) ? supplierRating : 0,
		reviews: Number(product.views ?? 0),
		tag: product.isFeatured ? "FEATURED" : "LIVE",
	};
};

export const mapCompanyToWidgetItem = (company: Company): HeroWidgetItem => ({
	id: company.id,
	type: "supplier",
	name: company.name,
	image: company.logoUrl,
	subtext: company.type || company.district || "Supplier",
	rating: Number(company.averageRating || 0),
	label: company.isVerified ? "VERIFIED" : "SUPPLIER",
});

export const mapProductToWidgetItem = (product: Product): HeroWidgetItem => {
	const variant = getProductPrimaryVariant(product);
	const price = Number(variant?.price ?? 0);
	const discount = Number(variant?.discount ?? 0);
	const discountedPrice =
		discount > 0
			? Math.max(Math.round(price * (1 - discount / 100)), 0)
			: price;

	return {
		id: product.id,
		type: "product",
		name: product.name,
		image: variant?.images?.[0],
		price: discountedPrice,
		label: discount > 0 ? `${Math.round(discount)}% OFF` : undefined,
		subtext: product.category?.name || "Product",
	};
};

export const mapServiceToWidgetItem = (service: Service): HeroWidgetItem => {
	const servicePrice =
		service.priceType === "NEGOTIABLE"
			? "Negotiable"
			: service.priceType === "STARTS_AT" && service.price != null
				? `From RWF ${Number(service.price).toLocaleString()}`
				: service.price != null
					? Number(service.price)
					: "Quote";

	return {
		id: service.id,
		type: "service",
		name: service.name,
		image: service.images?.[0],
		subtext: service.category?.name || service.company?.name || "Service",
		price: servicePrice,
	};
};
