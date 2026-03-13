import { RiAddLine, RiSearchLine } from "@remixicon/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	useCreateProductCategoryMutation,
	useDeleteProductCategoryMutation,
	useGetProductCategoriesQuery,
	useUpdateProductCategoryMutation,
} from "@/services/api/product-categories";
import { Card } from "@/shared/components/admin/card";
import { PageHeader } from "@/shared/components/admin/page-header";
import { CategoryCard } from "./categories/category-card";
import { ActionModal } from "@/shared/components/action-modal";
import { CategoryForm } from "@/features/forms/components/category-form";
import { toast } from "sonner";

export function AdminCategoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<any>(null);

	const { data: categoriesResult, isLoading } = useGetProductCategoriesQuery({
		limit: 100,
	});
	const [createCategory] = useCreateProductCategoryMutation();
	const [updateCategory] = useUpdateProductCategoryMutation();
	const [deleteCategory] = useDeleteProductCategoryMutation();

	const categories = categoriesResult?.data ?? [];

	const filteredCategories = useMemo(() => {
		return categories.filter((category) =>
			category.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [categories, searchQuery]);

	const handleCreateCategory = async (values: any) => {
		try {
			await createCategory(values).unwrap();
			toast.success("Category created successfully");
			setIsCreateModalOpen(false);
		} catch (error) {
			console.error(error);
			toast.error("Failed to create category");
		}
	};

	const handleUpdateCategory = async (values: any) => {
		if (!editingCategory) return;
		try {
			await updateCategory({
				id: editingCategory.id,
				data: values,
			}).unwrap();
			toast.success("Category updated successfully");
			setEditingCategory(null);
		} catch (error) {
			console.error(error);
			toast.error("Failed to update category");
		}
	};

	const handleDeleteCategory = async (id: string) => {
		try {
			await deleteCategory(id).unwrap();
			toast.success("Category deleted successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete category");
		}
	};

	return (
		<div className="space-y-6 pb-14">
			<PageHeader
				title="Categories"
				subtitle="Manage product categories"
				badge="System Management"
				actions={
					<Button
						onClick={() => setIsCreateModalOpen(true)}
						className="h-11 rounded-sm px-6 font-heading font-bold uppercase text-xs tracking-wider"
					>
						<RiAddLine size={18} className="mr-2" />
						Add Category
					</Button>
				}
			/>

			<Card noPadding>
				<div className="p-4 bg-muted/10 border-b border-border/40">
					<div className="relative max-w-sm">
						<RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search categories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-10 rounded-none border-border/40"
						/>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-48 w-full rounded-none" />
					))
				) : filteredCategories.length === 0 ? (
					<div className="col-span-full py-12">
						<Empty className="max-w-md mx-auto">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<RiSearchLine className="w-4 h-4 text-muted-foreground/40" />
								</EmptyMedia>
								<EmptyTitle className="text-xl font-display font-black uppercase">
									No categories found
								</EmptyTitle>
								<EmptyDescription className="uppercase tracking-widest text-[10px]">
									{searchQuery
										? `No categories match "${searchQuery}"`
										: "No categories have been created yet."}
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</div>
				) : (
					filteredCategories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category as any}
							onEdit={() => setEditingCategory(category)}
							onDelete={() => handleDeleteCategory(category.id)}
						/>
					))
				)}
			</div>

			<ActionModal
				isOpen={isCreateModalOpen}
				onCancel={() => setIsCreateModalOpen(false)}
				type="info"
				title="Add New Category"
				description="Create a new product category for the marketplace"
				showFooter={false}
			>
				<CategoryForm
					onSubmit={handleCreateCategory}
					mode="add"
					onCancel={() => setIsCreateModalOpen(false)}
				/>
			</ActionModal>

			<ActionModal
				isOpen={!!editingCategory}
				onCancel={() => setEditingCategory(null)}
				type="info"
				title="Edit Category"
				description={`Update information for ${editingCategory?.name}`}
				showFooter={false}
			>
				<CategoryForm
					initialValues={editingCategory}
					onSubmit={handleUpdateCategory}
					mode="edit"
					onCancel={() => setEditingCategory(null)}
				/>
			</ActionModal>
		</div>
	);
}
