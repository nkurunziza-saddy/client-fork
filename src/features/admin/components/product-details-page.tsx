import { AdminPageSkeleton } from "@/shared/components/skeletons";
import {
	RiArrowLeftSLine,
	RiBuilding2Line,
	RiCalendarLine,
	RiDeleteBinLine,
	RiEditLine,
	RiEyeLine,
	RiPriceTagLine,
	RiStockLine,
} from "@remixicon/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCompanyByIdQuery } from "@/services/api/companies";
import {
	useDeleteProductMutation,
	useGetProductByIdQuery,
} from "@/services/api/products";
import { ConfirmationModal } from "@/shared/components/confirmation-modal";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { formatDate } from "@/shared/utils/format";

export function AdminProductDetailsPage() {
	const { supplierId, productId } = useParams({
		from: "/admin/suppliers/$supplierId/product/$productId/",
	});
	const navigate = useNavigate();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const { data: product, isLoading: loadingProduct } =
		useGetProductByIdQuery(productId);
	const { data: supplier, isLoading: loadingSupplier } =
		useGetCompanyByIdQuery(supplierId);
	const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

	const isLoading = loadingProduct || loadingSupplier;

	const images = useMemo(
		() => product?.variants?.flatMap((variant) => variant.images ?? []) ?? [],
		[product],
	);

	const primaryVariant = product?.variants?.[0];

	const specs = useMemo(() => {
		if (!product) return [];
		return [
			{ label: "Category", value: product.category?.name ?? "-" },
			{ label: "Price Type", value: product.priceType },
			{
				label: "Base Price",
				value: `RWF ${(primaryVariant?.price ?? 0).toLocaleString()}`,
			},
			{ label: "Stock", value: `${primaryVariant?.stock ?? 0}` },
			{ label: "Views", value: `${product.views ?? 0}` },
			{ label: "Created", value: formatDate(product.createdAt) },
		];
	}, [primaryVariant?.price, primaryVariant?.stock, product]);

	const handleDelete = async () => {
		if (!product) return;
		try {
			await deleteProduct(product.id).unwrap();
			navigate({ to: `/admin/suppliers/${supplierId}` as any });
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return <AdminPageSkeleton />;
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
						Back to Supplier
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-14">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					onClick={() =>
						navigate({ to: `/admin/suppliers/${supplierId}` as any })
					}
					className="group flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider text-foreground hover:bg-muted"
				>
					<RiArrowLeftSLine
						size={16}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Back to Supplier
				</Button>
			</div>

			<PageHeader
				title={product.name}
				subtitle={`Product listing for ${supplier.name}`}
				badge="Product Detail"
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<Card noPadding className="overflow-hidden">
						<div className="relative aspect-video bg-muted">
							{images[selectedImageIndex] ? (
								<img
									src={images[selectedImageIndex]}
									alt={product.name}
									className="h-full w-full object-cover"
									onError={(e) => {
										e.currentTarget.src = "/image-fallback.svg";
									}}
								/>
							) : (
								<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
									No image available
								</div>
							)}
						</div>

						{images.length > 1 && (
							<div className="grid grid-cols-5 gap-2 border-t border-border p-3">
								{images.map((image, index) => (
									<button type="button"
										key={`${image}-${index}`}
										onClick={() => setSelectedImageIndex(index)}
										className={`aspect-square overflow-hidden rounded-sm border ${
											selectedImageIndex === index
												? "border-primary"
												: "border-border"
										}`}
									>
										<img
											src={image}
											alt=""
											className="h-full w-full object-cover"
											onError={(e) => {
												e.currentTarget.src = "/image-fallback.svg";
											}}
										/>
									</button>
								))}
							</div>
						)}
					</Card>

					<Card title="Description" subtitle="Product content">
						<p className="text-sm leading-relaxed text-muted-foreground">
							{product.description || "No description provided."}
						</p>
					</Card>

					<Card title="Details" subtitle="Product information">
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{specs.map((spec) => (
								<div
									key={spec.label}
									className="rounded-sm border border-border bg-muted/10 p-3"
								>
									<p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">
										{spec.label}
									</p>
									<p className="mt-1 text-sm font-semibold text-foreground">
										{spec.value}
									</p>
								</div>
							))}
						</div>
					</Card>
				</div>

				<div className="space-y-6">
					<Card
						title="Supplier"
						headerActions={
							<RiBuilding2Line size={16} className="text-primary" />
						}
					>
						<div className="space-y-3">
							<p className="font-heading text-lg font-bold text-foreground">
								{supplier.name}
							</p>
							<p className="text-sm text-muted-foreground">
								{[supplier.district, supplier.province]
									.filter(Boolean)
									.join(", ") || "-"}
							</p>
							<div className="flex flex-wrap gap-2">
								<Badge
									variant={supplier.isVerified ? "success" : "warning"}
									className="text-[10px] uppercase tracking-wider"
								>
									{supplier.isVerified ? "verified" : "pending"}
								</Badge>
								<Badge
									variant={supplier.isActive ? "default" : "secondary"}
									className="text-[10px] uppercase tracking-wider"
								>
									{supplier.isActive ? "active" : "inactive"}
								</Badge>
							</div>
						</div>
					</Card>

					<Card title="Quick Stats" subtitle="Current listing performance">
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-sm border border-border bg-muted/10 p-3">
								<span className="flex items-center gap-2 text-xs text-muted-foreground">
									<RiEyeLine size={14} /> Views
								</span>
								<span className="font-semibold">{product.views ?? 0}</span>
							</div>
							<div className="flex items-center justify-between rounded-sm border border-border bg-muted/10 p-3">
								<span className="flex items-center gap-2 text-xs text-muted-foreground">
									<RiStockLine size={14} /> Stock
								</span>
								<span className="font-semibold">
									{primaryVariant?.stock ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between rounded-sm border border-border bg-muted/10 p-3">
								<span className="flex items-center gap-2 text-xs text-muted-foreground">
									<RiPriceTagLine size={14} /> Price
								</span>
								<span className="font-semibold">
									RWF {(primaryVariant?.price ?? 0).toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between rounded-sm border border-border bg-muted/10 p-3">
								<span className="flex items-center gap-2 text-xs text-muted-foreground">
									<RiCalendarLine size={14} /> Created
								</span>
								<span className="font-semibold">
									{formatDate(product.createdAt)}
								</span>
							</div>
						</div>
					</Card>

					<div className="space-y-3">
						<Button
							onClick={() =>
								navigate({
									to: `/admin/suppliers/${supplierId}/product/${productId}/edit` as any,
								})
							}
							className="h-12 w-full rounded-sm"
						>
							<RiEditLine size={16} className="mr-2" /> Edit Product
						</Button>
						<Button
							variant="outline"
							onClick={() => setShowDeleteModal(true)}
							className="h-12 w-full rounded-sm border-destructive/20 bg-destructive/60 text-destructive hover:bg-destructive/5"
						>
							<RiDeleteBinLine size={16} className="mr-2" /> Delete Product
						</Button>
					</div>
				</div>
			</div>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Delete Product"
				message={`Delete "${product.name}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				type="delete"
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteModal(false)}
				isLoading={deleting}
			/>
		</div>
	);
}
