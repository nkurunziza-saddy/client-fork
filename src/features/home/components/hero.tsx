import { RiLayoutGridLine } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Star } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { useGetProductsQuery } from "@/services/api/products";
import { useGetServicesQuery } from "@/services/api/services";
import { useGetMarketplaceStatsQuery } from "@/services/api/stats";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";
import type { Company, HeroWidgetItem, Product, Service } from "@/types";
import { HeroWidget } from "./hero-widget";

const DEFAULT_SEARCH_CATEGORY = "All Categories";

interface HeroFeaturedProduct {
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

const formatRwf = (value: number): string => `RWF ${value.toLocaleString()}`;

const getProductPrimaryVariant = (product: Product) => product.variants?.[0];

const mapProductToHeroFeaturedProduct = (
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
		price: formatRwf(discountedPrice),
		originalPrice:
			discountPercent > 0 && basePrice > 0 ? formatRwf(basePrice) : undefined,
		discount:
			discountPercent > 0 ? `-${Math.round(discountPercent)}%` : undefined,
		supplier: product.company?.name || "Unknown Supplier",
		rating: Number.isFinite(supplierRating) ? supplierRating : 0,
		reviews: Number(product.views ?? 0),
		tag: product.isFeatured ? "FEATURED" : "LIVE",
	};
};

const mapCompanyToWidgetItem = (company: Company): HeroWidgetItem => ({
	id: company.id,
	type: "supplier",
	name: company.name,
	image: company.logoUrl,
	subtext: company.type || company.district || "Supplier",
	rating: Number(company.averageRating || 0),
	label: company.isVerified ? "VERIFIED" : "SUPPLIER",
});

const mapProductToWidgetItem = (product: Product): HeroWidgetItem => {
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

const mapServiceToWidgetItem = (service: Service): HeroWidgetItem => {
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

// sub-components

// featured product card component
const FeaturedProductCard: React.FC<{
	product: HeroFeaturedProduct;
	isActive: boolean;
}> = ({ product, isActive }) => {
	const navigate = useNavigate();

	return (
		<div
			className={`absolute inset-0 transition-opacity duration-1000 ${
				isActive
					? "opacity-100 pointer-events-auto scale-100"
					: "opacity-0 pointer-events-none scale-105"
			} transition-transform`}
		>
			<div className="absolute inset-0">
				<ImageWithFallback
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-industrial via-industrial/40 to-transparent" />
				<div className="absolute inset-0 bg-industrial/20" />
			</div>

			{/* Top Bar with Badges */}
			<div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
				<Badge className="bg-primary text-primary-foreground border-none text-[9px] font-black tracking-[0.2em] px-2.5 py-1.5 h-auto rounded-none uppercase shadow-xl">
					{product.tag}
				</Badge>
				{product.discount && (
					<div className="bg-success text-success-foreground text-[9px] font-black rounded-none px-2 py-1 uppercase tracking-widest shadow-xl">
						{product.discount}
					</div>
				)}
			</div>

			{/* Bottom Content Area */}
			<div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 pt-10 md:pt-20 bg-gradient-to-t from-industrial to-transparent">
				<div className="flex items-center gap-3 mb-3">
					<div className="w-6 h-px bg-primary" />
					<p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
						{product.category}
					</p>
				</div>

				<h3 className="text-white font-black text-xl md:text-3xl lg:text-4xl leading-tight mb-3 uppercase tracking-tighter">
					{product.name}
				</h3>

				<div className="flex items-center gap-1.5 mb-5 opacity-70">
					<div className="flex items-center gap-0.5">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`w-2 h-2 ${
									star <= Math.floor(product.rating)
										? "fill-warning text-warning"
										: "fill-white/20 text-white/20"
								}`}
							/>
						))}
					</div>
					<span className="text-white text-[8px] font-black uppercase tracking-widest">
						{product.rating > 0 ? product.rating : "N/A"} · {product.reviews}{" "}
						VIEWS
					</span>
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
					<div className="flex flex-col">
						<span className="text-white font-black text-xl md:text-2xl tracking-tighter">
							{product.price}
						</span>
						{product.originalPrice && (
							<span className="text-white/30 text-[9px] line-through font-bold">
								{product.originalPrice}
							</span>
						)}
					</div>
					<Button
						onClick={() => navigate({ to: "/products" })}
						className="bg-background hover:bg-muted text-foreground rounded-none h-10 px-6 text-[9px] font-black tracking-[0.2em] uppercase gap-2 group border-none"
					>
						VIEW{" "}
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</Button>
				</div>
			</div>
		</div>
	);
};

// hero component

const Hero: React.FC = () => {
	const navigate = useNavigate();
	const [query, setQuery] = React.useState("");
	const [activeCategory, setActiveCategory] = React.useState(
		DEFAULT_SEARCH_CATEGORY,
	);
	const [activeFeatured, setActiveFeatured] = React.useState(0);
	const { data: featuredProductsResult } = useGetProductsQuery({
		limit: 3,
		isFeatured: true,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});
	const { data: latestProductsResult } = useGetProductsQuery({
		limit: 3,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});
	const { data: productCategoriesResult } = useGetProductCategoriesQuery({
		limit: 8,
	});
	const { data: marketplaceStats } = useGetMarketplaceStatsQuery();
	const { data: companiesResult } = useGetCompaniesQuery({
		limit: 6,
		isVerified: true,
		sortBy: "averageRating",
		sortOrder: "DESC",
	});
	const { data: servicesResult } = useGetServicesQuery({
		limit: 3,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});

	const featuredProducts = React.useMemo(() => {
		const preferred = featuredProductsResult?.data ?? [];
		const fallback = latestProductsResult?.data ?? [];
		const source = preferred.length > 0 ? preferred : fallback;
		return source.slice(0, 3).map(mapProductToHeroFeaturedProduct);
	}, [featuredProductsResult?.data, latestProductsResult?.data]);

	const searchCategories = React.useMemo(
		() => [
			DEFAULT_SEARCH_CATEGORY,
			...(productCategoriesResult?.data.map(
				(category: { name: string }) => category.name,
			) ?? []),
		],
		[productCategoriesResult?.data],
	);

	const manufacturerItems = React.useMemo<HeroWidgetItem[]>(() => {
		const companies = (companiesResult?.data ?? []).slice(0, 3);
		return [
			{
				id: "manufacturers-stat",
				type: "stat",
				stat: `${marketplaceStats?.verifiedSuppliers ?? 0}+`,
				statDesc: "Direct",
			},
			...companies.map(mapCompanyToWidgetItem),
		];
	}, [companiesResult?.data, marketplaceStats?.verifiedSuppliers]);

	const productItems = React.useMemo<HeroWidgetItem[]>(() => {
		const products = featuredProductsResult?.data?.slice(0, 3) ?? [];
		return [
			{
				id: "products-stat",
				type: "stat",
				stat: `${marketplaceStats?.productsListed ?? 0}+`,
				statDesc: "Available",
			},
			...products.map(mapProductToWidgetItem),
		];
	}, [featuredProductsResult?.data, marketplaceStats?.productsListed]);

	const supplierItems = React.useMemo<HeroWidgetItem[]>(() => {
		const companies = (companiesResult?.data ?? []).slice(3, 6);
		return [
			{
				id: "suppliers-stat",
				type: "stat",
				stat: `${marketplaceStats?.verifiedSuppliers ?? 0}+`,
				statDesc: "Verified",
			},
			...companies.map(mapCompanyToWidgetItem),
		];
	}, [companiesResult?.data, marketplaceStats?.verifiedSuppliers]);

	const serviceItems = React.useMemo<HeroWidgetItem[]>(() => {
		const services = servicesResult?.data?.slice(0, 3) ?? [];
		return [
			{
				id: "services-stat",
				type: "stat",
				stat: `${marketplaceStats?.activeContractors ?? 0}+`,
				statDesc: "Active",
			},
			...services.map(mapServiceToWidgetItem),
		];
	}, [marketplaceStats?.activeContractors, servicesResult?.data]);

	React.useEffect(() => {
		if (featuredProducts.length === 0) return;
		const id = setInterval(() => {
			setActiveFeatured((prev) => (prev + 1) % featuredProducts.length);
		}, 5000);
		return () => clearInterval(id);
	}, [featuredProducts.length]);

	React.useEffect(() => {
		if (activeFeatured >= featuredProducts.length) {
			setActiveFeatured(0);
		}
	}, [activeFeatured, featuredProducts.length]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		navigate({
			to: "/products",
			search: {
				q: query,
				category: activeCategory,
			},
		} as any);
	};

	return (
		<section className="relative py-0 md:py-4 bg-background industrial-grain">
			<div className="max-w-[1800px] mx-auto px-0 md:px-6">
				{/* Unified Hero Container */}
				<div className="relative overflow-hidden border-y md:border border-border/20 shadow-2xl mb-2 md:mb-4 bg-industrial flex flex-col md:flex-row shadow-primary/5 min-h-[380px] md:min-h-[420px]">
					{/* Background Decorations */}
					<div
						className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none"
						style={{
							maskImage: "linear-gradient(to bottom right, black, transparent)",
						}}
					/>
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,var(--color-primary)_0%,transparent_40%)] opacity-[0.08] pointer-events-none" />

					{/* search panel */}
					<div className="relative z-20 flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 flex-1 md:max-w-[55%]">
						<div className="flex items-center gap-4 mb-4 md:mb-6 relative">
							<span className="inline-flex items-center gap-3 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">
								<div className="w-8 md:w-16 h-px bg-primary" />
								Construction Marketplace
							</span>
						</div>

						<h1 className="text-display font-black text-white leading-[0.85] mb-6 md:mb-8 relative tracking-tighter">
							<span className="block text-2xl sm:text-4xl md:text-4xl lg:text-5xl uppercase">
								FIND EVERY
							</span>
							<span className="block text-2xl sm:text-4xl md:text-4xl lg:text-5xl text-primary italic -skew-x-12 inline-block translate-x-1 sm:translate-x-6">
								MATERIAL & SERVICE
							</span>
							<span className="block text-2xl sm:text-4xl md:text-4xl lg:text-5xl uppercase">
								IN RWANDA.
							</span>
						</h1>
						<form onSubmit={handleSearch} className="relative max-w-2xl w-full">
							<div className="group/search-bar flex items-stretch rounded-none relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/40 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-500">
								{/* Type Selector */}
								<Select
									value={activeCategory}
									onValueChange={(val: string | null) => {
										if (val) setActiveCategory(val);
									}}
								>
									<SelectTrigger className="!h-auto px-3 sm:px-8 py-4 sm:py-0 flex items-center justify-center gap-2 text-[10px] font-black text-white hover:text-primary uppercase tracking-[0.2em] border-none sm:border-r border-white/10 transition-all whitespace-nowrap bg-transparent rounded-none border-y-0 border-l-0 group/select w-12 sm:w-auto sm:min-w-[180px] hover:bg-white/[0.03] [&_svg]:opacity-30">
										<div className="sm:hidden">
											<RiLayoutGridLine className="w-4 h-4" />
										</div>
										<div className="hidden sm:block">
											<SelectValue>
												{activeCategory === DEFAULT_SEARCH_CATEGORY
													? "All Categories"
													: activeCategory}
											</SelectValue>
										</div>
									</SelectTrigger>
									<SelectContent className="bg-industrial/95 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl p-1 min-w-[200px] sm:min-w-[240px]">
										<SelectGroup>
											<SelectLabel className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 px-3 py-4 border-b border-white/5 mb-2">
												Market Categories
											</SelectLabel>
											{searchCategories.map((cat) => (
												<SelectItem
													key={cat}
													value={cat}
													className="text-[10px] font-black uppercase tracking-widest text-white/60 focus:bg-primary focus:text-white rounded-none transition-all py-3 px-4 mb-1 h-auto"
												>
													{cat}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>

								{/* Input + Button Group */}
								<div className="flex flex-1 relative items-stretch">
									<div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within/search-bar:text-primary/50 transition-colors z-10">
										<Search className="w-4 h-4" />
									</div>
									<input
										type="text"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Search materials, tools, etc..."
										className="w-full bg-transparent pl-9 sm:pl-12 pr-3 sm:pr-8 py-4 md:py-5 text-white text-sm sm:text-base md:text-lg outline-none min-w-0 font-display font-medium tracking-tight"
									/>
									<button
										type="submit"
										className="shrink-0 bg-primary hover:bg-primary/90 active:scale-95 transition-all px-4 sm:px-8 md:px-12 flex items-center justify-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.3em] group/btn-search min-h-[48px] sm:min-h-0"
									>
										<Search className="w-5 h-5" />
										<span className="hidden sm:inline">Search</span>
										<ArrowRight className="w-4 h-4 hidden sm:block group-hover/btn-search:translate-x-1 transition-transform" />
									</button>
								</div>

								{/* Focus indicator line */}
								<div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-focus-within/search-bar:w-full transition-all duration-700 ease-in-out shadow-[0_0_15px_var(--color-primary)]" />
							</div>
						</form>
					</div>
					{/* featured products carousel */}
					<div className="relative md:w-[45%] min-h-[300px] md:min-h-0 shrink-0 overflow-hidden border-t md:border-t-0 md:border-l border-white/10 group/featured">
						{featuredProducts.map((product: HeroFeaturedProduct, i: number) => (
							<FeaturedProductCard
								key={product.id}
								product={product}
								isActive={i === activeFeatured}
							/>
						))}

						{/* Slides */}
						<div className="absolute bottom-6 left-8 z-20 flex gap-2">
							{featuredProducts.map(
								(product: HeroFeaturedProduct, i: number) => (
									<button
										key={product.id}
										onClick={() => setActiveFeatured(i)}
										className={`h-1.5 transition-all duration-500 rounded-full ${
											i === activeFeatured
												? "w-12 bg-primary"
												: "w-4 bg-white/20 hover:bg-white/40"
										}`}
										aria-label={`Show featured item ${i + 1}`}
									/>
								),
							)}
						</div>
					</div>
				</div>

				{/* widgets grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 px-4 md:px-0 relative z-20 pb-4 md:pb-0">
					<HeroWidget
						title="Top Manufacturers"
						subtitle="Direct access"
						items={manufacturerItems}
						href="/suppliers?type=manufacturer"
						variant="default"
					/>
					<HeroWidget
						title="Top Products"
						subtitle="Trending now"
						items={productItems}
						href="/products?sort=popular"
						variant="blue"
					/>
					<HeroWidget
						title="Top Suppliers"
						subtitle="Trusted partners"
						items={supplierItems}
						href="/suppliers"
						variant="emerald"
					/>
					<HeroWidget
						title="Top Services"
						subtitle="Expert solutions"
						items={serviceItems}
						href="/services"
						variant="orange"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
