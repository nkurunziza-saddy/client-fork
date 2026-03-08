import {
	RiArrowLeftSLine,
	RiLoader2Line,
	RiMoneyDollarCircleLine,
	RiPagesLine,
	RiSaveLine,
} from "@remixicon/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetCompanyByIdQuery } from "@/services/api/companies";
import {
	useGetProductByIdQuery,
	useUpdateProductMutation,
} from "@/services/api/products";
import { Card } from "./card";
import { PageHeader } from "./page-header";

export function AdminEditProductPage() {
	const { supplierId, productId } = useParams({
		from: "/admin/suppliers/$supplierId/product/$productId/edit",
	});
	const navigate = useNavigate();

	const { data: product, isLoading: isProductLoading } =
		useGetProductByIdQuery(productId);
	const { data: supplier, isLoading: isSupplierLoading } =
		useGetCompanyByIdQuery(supplierId);
	const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();

	const isLoadingData = isProductLoading || isSupplierLoading;

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		subcategory: "",
		minPrice: 0,
		maxPrice: 0,
		minimumOrder: 1,
		availability: "in-stock",
	});

	useEffect(() => {
		if (!product) return;
		setFormData({
			name: product.name || "",
			description: product.description || "",
			category: product.category?.id || "",
			subcategory: product.category?.name || "",
			minPrice: product.variants?.[0]?.price || 0,
			maxPrice: product.variants?.[0]?.price || 0,
			minimumOrder: 1,
			availability:
				(product.variants?.[0]?.stock || 0) > 0 ? "in-stock" : "out-of-stock",
		});
	}, [product]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "minPrice" || name === "maxPrice" || name === "minimumOrder"
					? Number(value)
					: value,
		}));
	};

	const handleSave = async () => {
		if (!product) return;
		try {
			await updateProduct({
				id: product.id,
				data: {
					name: formData.name,
					description: formData.description,
					categoryId: formData.category || undefined,
					price: Number(formData.minPrice),
					stock: formData.availability === "out-of-stock" ? 0 : undefined,
				},
			}).unwrap();
			navigate({
				to: `/admin/suppliers/${supplierId}/product/${productId}` as any,
			});
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoadingData) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<RiLoader2Line className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!product || !supplier) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Card className="max-w-sm p-8 text-center">
					<h1 className="mb-4 text-xl font-heading font-bold uppercase tracking-widest text-foreground">
						Product Not Found
					</h1>
					<Button
						onClick={() =>
							navigate({ to: `/admin/suppliers/${supplierId}` as any })
						}
						className="h-11 w-full rounded-sm font-heading font-bold uppercase text-xs tracking-wider"
					>
						Return to Supplier
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-20">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					onClick={() =>
						navigate({
							to: `/admin/suppliers/${supplierId}/product/${productId}` as any,
						})
					}
					className="group flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider text-foreground hover:bg-muted"
				>
					<RiArrowLeftSLine
						size={16}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Back to Product
				</Button>
			</div>

			<PageHeader
				title="Edit Product"
				subtitle={`Updating ${product.name}`}
				badge="Product Management"
			/>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-8 lg:col-span-2">
					<Card
						title="Product Details"
						subtitle="Core listing data"
						headerActions={<RiPagesLine size={16} className="text-primary" />}
					>
						<div className="space-y-6">
							<div className="space-y-2">
								<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
									Product Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
								/>
							</div>
							<div className="space-y-2">
								<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
									Description
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={4}
									className="w-full resize-none rounded-sm border border-border bg-background px-4 py-3 text-sm"
								/>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
										Category ID
									</label>
									<input
										type="text"
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
										Category Label
									</label>
									<input
										type="text"
										name="subcategory"
										value={formData.subcategory}
										onChange={handleInputChange}
										className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
									/>
								</div>
							</div>
						</div>
					</Card>
				</div>

				<div className="space-y-8">
					<Card
						title="Pricing"
						subtitle="Commercial values"
						headerActions={
							<RiMoneyDollarCircleLine size={16} className="text-primary" />
						}
					>
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
										Min Price
									</label>
									<input
										type="number"
										name="minPrice"
										value={formData.minPrice}
										onChange={handleInputChange}
										className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
										Max Price
									</label>
									<input
										type="number"
										name="maxPrice"
										value={formData.maxPrice}
										onChange={handleInputChange}
										className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="ml-1 block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
									Availability
								</label>
								<select
									name="availability"
									value={formData.availability}
									onChange={handleInputChange}
									className="h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm"
								>
									<option value="in-stock">In Stock</option>
									<option value="out-of-stock">Out of Stock</option>
								</select>
							</div>
						</div>
					</Card>

					<Button
						onClick={handleSave}
						disabled={saving}
						className="h-14 w-full rounded-sm font-heading font-bold uppercase text-xs tracking-widest"
					>
						{saving ? "Saving..." : "Save Product"}
						{!saving && <RiSaveLine size={18} className="ml-2" />}
					</Button>
				</div>
			</div>
		</div>
	);
}
