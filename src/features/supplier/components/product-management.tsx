import {
	RiAddLine,
	RiDeleteBinLine,
	RiEditLine,
	RiEyeLine,
	RiLayoutGridLine,
	RiSearchLine,
} from "@remixicon/react";
import {
	LayoutList as RiListCheckLine,
	Package as RiPackageLine,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	ProductForm,
	type ProductFormValues,
} from "@/features/forms/components/product-form";
import { cn } from "@/lib/utils";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useGetProductsQuery,
} from "@/services/api/products";
import { Card as AdminCard } from "@/shared/components/admin/card";
import type { Product } from "@/types";

const ProductManagement: React.FC = () => {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [showAddProduct, setShowAddProduct] = useState(false);
	const [page, setPage] = useState(1);

	const { data: company } = useGetMyCompanyQuery();

	const {
		data: productsData,
		isLoading,
		isFetching,
	} = useGetProductsQuery(
		{ companyId: company?.id, limit: 20, page },
		{ skip: !company?.id },
	);

	const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
	const [deleteProduct] = useDeleteProductMutation();

	const products: Product[] = productsData?.data ?? [];
	const meta = productsData?.meta;

	const filteredProducts = useMemo(() => {
		if (!searchQuery) return products;
		return products.filter((p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [products, searchQuery]);

	const handleCreate = async (values: ProductFormValues) => {
		if (!company?.id) return;
		try {
			await createProduct({
				name: values.name,
				description: values.description || "",
				categoryId: values.categoryId,
				companyId: company.id,
				price: parseFloat(values.price) || 0,
				priceType: values.priceType,
				stock: parseInt(values.stock, 10) || 0,
				unit: values.unit,
				images: values.imageUrls || [],
			}).unwrap();
			toast.success("Product created");
			setShowAddProduct(false);
		} catch {
			toast.error("Failed to create product");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id).unwrap();
			toast.success("Product deleted");
		} catch {
			toast.error("Failed to delete product");
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border pb-6">
				<div>
					<h2 className="text-4xl font-heading font-bold text-foreground uppercase tracking-tight">
						Product Management
					</h2>
					<p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
						Manage your products and items
					</p>
				</div>
				<Button
					onClick={() => setShowAddProduct(true)}
					className="rounded-sm h-12 px-6 font-heading font-bold uppercase tracking-widest shadow-none"
				>
					<RiAddLine className="w-5 h-5 mr-2" />
					Add Listing
				</Button>
			</div>

			<AdminCard noPadding>
				<div className="p-3 flex flex-col lg:flex-row gap-4 bg-muted/10">
					<div className="flex-1 relative">
						<RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="SEARCH PRODUCTS..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-11 bg-background border border-border uppercase text-xs font-bold tracking-widest shadow-none"
						/>
					</div>
					<div className="flex items-center bg-muted border border-border rounded-sm p-1">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={cn(
								"p-1.5 rounded-sm transition-all",
								viewMode === "grid"
									? "bg-background text-primary shadow-sm border border-border"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<RiLayoutGridLine className="w-4 h-4" />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							className={cn(
								"p-1.5 rounded-sm transition-all",
								viewMode === "list"
									? "bg-background text-primary shadow-sm border border-border"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<RiListCheckLine className="w-4 h-4" />
						</button>
					</div>
				</div>
			</AdminCard>

			{isLoading || isFetching ? (
				<div
					className={cn(
						"grid gap-6",
						viewMode === "grid"
							? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
							: "grid-cols-1",
					)}
				>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="h-64 rounded-sm border border-border bg-muted/30 animate-pulse"
						/>
					))}
				</div>
			) : (
				<>
					<div
						className={cn(
							"grid gap-6",
							viewMode === "grid"
								? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
								: "grid-cols-1",
						)}
					>
						{filteredProducts.map((product) => {
							const minPrice = Math.min(
								...(product.variants?.map(
									(v: { price: number }) => v.price,
								) ?? [0]),
							);
							const totalStock = (product.variants ?? []).reduce(
								(s: number, v: { stock: number }) => s + v.stock,
								0,
							);
							const firstImage = product.variants?.[0]?.images?.[0];

							return (
								<AdminCard
									key={product.id}
									noPadding
									className="hover:border-primary transition-colors flex flex-col"
								>
									<div className="relative aspect-video overflow-hidden border-b-2 border-border bg-muted">
										{firstImage ? (
											<img
												src={firstImage}
												alt={product.name}
												className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
												onError={(e) => {
													e.currentTarget.src = "/image-fallback.svg";
												}}
											/>
										) : (
											<div className="absolute inset-0 flex items-center justify-center">
												<RiPackageLine className="w-12 h-12 text-muted-foreground/20" />
											</div>
										)}
										<div className="absolute top-3 right-3">
											<Badge
												variant={product.isActive ? "success" : "destructive"}
												className="uppercase text-[9px] font-black tracking-[0.2em]"
											>
												{product.isActive ? "active" : "inactive"}
											</Badge>
										</div>
									</div>

									<div className="p-5 flex-grow">
										<div className="mb-3">
											<span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-1 rounded-sm border border-primary/10">
												{product.category?.name ?? "—"}
											</span>
										</div>

										<h3 className="font-heading font-bold text-foreground mb-4 uppercase tracking-tight text-lg leading-tight line-clamp-2">
											{product.name}
										</h3>

										<div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y-2 border-border border-dashed">
											<div>
												<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">
													Price
												</span>
												<div className="font-bold text-foreground text-sm">
													{minPrice > 0
														? `RWF ${minPrice.toLocaleString()}`
														: "—"}
												</div>
											</div>
											<div>
												<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">
													Stock
												</span>
												<div
													className={cn(
														"font-bold text-sm",
														totalStock > 0
															? "text-success"
															: "text-destructive",
													)}
												>
													{totalStock} units
												</div>
											</div>
										</div>

										<div className="flex gap-2">
											<Button className="flex-1 rounded-sm h-10 font-heading font-bold uppercase tracking-widest text-[10px] shadow-none">
												<RiEditLine className="w-3.5 h-3.5 mr-1.5" />
												Edit
											</Button>
											<Button
												variant="outline"
												size="icon"
												className="h-10 w-10 border border-border rounded-sm hover:border-primary"
											>
												<RiEyeLine className="w-4 h-4 text-muted-foreground" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleDelete(product.id)}
												className="h-10 w-10 border border-border rounded-sm hover:border-destructive hover:bg-destructive/5 group"
											>
												<RiDeleteBinLine className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
											</Button>
										</div>
									</div>
								</AdminCard>
							);
						})}
					</div>

					{filteredProducts.length === 0 ? (
						<Empty className="py-20 bg-muted/5 border border-dashed border-border rounded-none">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<RiPackageLine className="w-4 h-4 text-primary" />
								</EmptyMedia>
								<EmptyTitle className="text-xl font-display font-black uppercase">
									No Products Yet
								</EmptyTitle>
								<EmptyDescription className="uppercase tracking-widest text-[10px]">
									Add your first product listing to get started
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									onClick={() => setShowAddProduct(true)}
									className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest shadow-none"
								>
									Create First Product
								</Button>
							</EmptyContent>
						</Empty>
					) : null}

					{meta && meta.totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-8 pt-6 border-t border-border">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => setPage((p) => p - 1)}
							>
								Previous
							</Button>
							<span className="flex items-center px-4 text-sm text-muted-foreground">
								Page {meta.page} of {meta.totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= meta.totalPages}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}

			<Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
				<DialogContent className="max-w-lg p-0 overflow-hidden shadow-none border border-border rounded-sm max-h-[90vh] overflow-y-auto">
					<div className="bg-muted/30 p-6 border-b-2 border-border relative overflow-hidden sticky top-0 z-10">
						<div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/20" />
						<DialogHeader>
							<DialogTitle className="text-lg font-heading font-bold uppercase tracking-wide">
								Add Product
							</DialogTitle>
						</DialogHeader>
					</div>
					<div className="p-6">
						<ProductForm
							onSubmit={handleCreate}
							onCancel={() => setShowAddProduct(false)}
							isLoading={isCreating}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ProductManagement;
