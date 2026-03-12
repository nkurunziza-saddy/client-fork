import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductForm } from "@/features/forms/components/product-form";
import { ServiceForm } from "@/features/forms/components/service-form";
import {
	useAddProductVariantMutation,
	useGetProductByIdQuery,
	useRemoveProductVariantMutation,
	useUpdateProductMutation,
} from "@/services/api/products";
import {
	useGetServiceByIdQuery,
	useUpdateServiceMutation,
} from "@/services/api/services";
import { ResponsiveModal } from "@/shared/components/responsive-modal";
import type { CreateProductVariantInput } from "@/types";

export function ProviderListingEditPage() {
	const { listingId } = useParams({
		from: "/dashboard/listings/$listingId/edit",
	});
	const search = useSearch({ strict: false });
	const itemType = (search as { type?: string }).type;
	const navigate = useNavigate();

	const [addVariantOpen, setAddVariantOpen] = useState(false);

	// Product hooks
	const { data: product, isLoading: productLoading } = useGetProductByIdQuery(
		listingId ?? "",
		{ skip: !listingId || itemType !== "PRODUCT" },
	);
	const [updateProduct, { isLoading: updatingProduct }] =
		useUpdateProductMutation();
	const [addProductVariant, { isLoading: addVarLoading }] =
		useAddProductVariantMutation();
	const [removeProductVariant] = useRemoveProductVariantMutation();

	const { data: service, isLoading: serviceLoading } = useGetServiceByIdQuery(
		listingId ?? "",
		{ skip: !listingId || itemType !== "SERVICE" },
	);
	const [updateService, { isLoading: updatingService }] =
		useUpdateServiceMutation();

	const isLoading = itemType === "PRODUCT" ? productLoading : serviceLoading;
	const isUpdating = itemType === "PRODUCT" ? updatingProduct : updatingService;
	const item = itemType === "PRODUCT" ? product : service;

	if (
		!listingId ||
		(!itemType && !isLoading) ||
		(item === null && !isLoading)
	) {
		return (
			<div className="p-8">
				<p className="text-muted-foreground">Listing not found.</p>
				<Button
					variant="outline"
					onClick={() => navigate({ to: "/dashboard" })}
					className="mt-4"
				>
					Back to Dashboard
				</Button>
			</div>
		);
	}

	if (isLoading || !item) {
		return (
			<div className="p-8">
				<div className="animate-pulse text-muted-foreground">Loading...</div>
			</div>
		);
	}

	const handleUpdateProduct = async (values: any) => {
		try {
			const { imageUrls, price, stock, ...rest } = values;
			const sanitizedData = {
				...rest,
				price: price ? Number(price) : undefined,
				stock: stock ? Number(stock) : undefined,
				images: imageUrls,
			};
			await updateProduct({ id: listingId, data: sanitizedData }).unwrap();
			toast.success("Product updated successfully");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error("Failed to update product");
			console.error(err);
		}
	};

	const handleUpdateService = async (values: any) => {
		try {
			const { imageUrls, price, discount, ...rest } = values;
			const sanitizedData = {
				...rest,
				price: price ? Number(price) : undefined,
				discount: discount ? Number(discount) : undefined,
				images: imageUrls,
			};
			await updateService({ id: listingId, data: sanitizedData }).unwrap();
			toast.success("Service updated successfully");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error("Failed to update service");
			console.error(err);
		}
	};

	return (
		<div className="p-8 max-w-2xl">
			<h1 className="text-xl font-heading font-bold uppercase text-foreground mb-6">
				Edit {itemType === "PRODUCT" ? "Product" : "Service"}
			</h1>

			{itemType === "PRODUCT" && product && (
				<>
					<ProductForm
						initialValues={{
							name: product.name,
							description: product.description ?? "",
							categoryId: product.category?.id ?? "",
							priceType: product.priceType,
							price: String(product.variants?.[0]?.price ?? product.price ?? 0),
							stock: String(product.variants?.[0]?.stock ?? product.stock ?? 0),
							unit: product.variants?.[0]?.unit ?? product.unit ?? "unit",
							imageUrls: product.images ?? [],
						}}
						onSubmit={handleUpdateProduct}
						onCancel={() => navigate({ to: "/dashboard" })}
						isLoading={isUpdating}
					/>

					<div className="mt-12 pt-8 border-t border-border">
						<h2 className="text-lg font-heading font-bold uppercase text-foreground mb-4">
							Variants
						</h2>
						<ul className="space-y-3 mb-4">
							{(product.variants ?? []).map((v: any) => (
								<li
									key={v.id}
									className="flex items-center justify-between p-3 rounded-sm border border-border bg-card"
								>
									<div>
										<p className="font-medium">{v.name}</p>
										<p className="text-sm text-muted-foreground">
											RWF {Number(v.price).toLocaleString()} · Stock: {v.stock}{" "}
											{v.unit ?? ""}
										</p>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive"
										onClick={async () => {
											if (confirm("Remove this variant?")) {
												try {
													await removeProductVariant(v.id).unwrap();
												} catch (e) {
													console.error(e);
												}
											}
										}}
									>
										<RiDeleteBinLine className="w-4 h-4" />
									</Button>
								</li>
							))}
						</ul>
						<Button
							type="button"
							variant="outline"
							onClick={() => setAddVariantOpen(true)}
							className="gap-2"
						>
							<RiAddLine className="w-4 h-4" />
							Add Variant
						</Button>
					</div>

					<AddVariantDialog
						open={addVariantOpen}
						onClose={() => setAddVariantOpen(false)}
						onSubmit={async (data) => {
							try {
								await addProductVariant({
									productId: listingId,
									data,
								}).unwrap();
								setAddVariantOpen(false);
							} catch (e) {
								console.error(e);
							}
						}}
						isLoading={addVarLoading}
					/>
				</>
			)}

			{itemType === "SERVICE" && service && (
				<ServiceForm
					initialValues={{
						name: service.name,
						description: service.description ?? "",
						categoryId: service.category?.id ?? "",
						price: String(service.price ?? 0),
						priceType: service.priceType,
						duration: service.duration ?? "",
						discount: String(service.discount ?? 0),
						imageUrls: service.images ?? [],
					}}
					onSubmit={handleUpdateService}
					onCancel={() => navigate({ to: "/dashboard" })}
					isLoading={isUpdating}
				/>
			)}
		</div>
	);
}

function AddVariantDialog({
	open,
	onClose,
	onSubmit,
	isLoading,
}: {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateProductVariantInput) => void;
	isLoading: boolean;
}) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [unit, setUnit] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const p = Number(price);
		const s = Number(stock);
		if (!name.trim() || Number.isNaN(p) || p < 0 || Number.isNaN(s) || s < 0)
			return;
		onSubmit({
			name: name.trim(),
			price: p,
			stock: s,
			unit: unit.trim() || undefined,
		});
		setName("");
		setPrice("");
		setStock("");
		setUnit("");
	};

	return (
		<ResponsiveModal
			open={open}
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
			title="Add Variant"
			description="Create a new option for this product."
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label className="block text-xs font-medium text-muted-foreground mb-1">
						Name *
					</Label>
					<Input
						value={name}
						onChange={(e: any) => setName(e.target.value)}
						placeholder="e.g. Size L, 50kg bag"
						required
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="block text-xs font-medium text-muted-foreground mb-1">
							Price *
						</Label>
						<Input
							type="number"
							step="0.01"
							min={0}
							value={price}
							onChange={(e: any) => setPrice(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label className="block text-xs font-medium text-muted-foreground mb-1">
							Stock *
						</Label>
						<Input
							type="number"
							min={0}
							value={stock}
							onChange={(e: any) => setStock(e.target.value)}
							required
						/>
					</div>
				</div>
				<div>
					<Label className="block text-xs font-medium text-muted-foreground mb-1">
						Unit
					</Label>
					<Input
						value={unit}
						onChange={(e: any) => setUnit(e.target.value)}
						placeholder="e.g. piece, kg"
					/>
				</div>
				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Adding..." : "Add Variant"}
					</Button>
				</div>
			</form>
		</ResponsiveModal>
	);
}
