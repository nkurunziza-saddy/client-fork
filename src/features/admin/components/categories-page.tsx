import { RiAddLine, RiLoader2Line, RiSearchLine } from "@remixicon/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { CategoryForm } from "@/features/forms/components/category-form";
import {
	useCreateCompanyCategoryMutation,
	useDeleteCompanyCategoryMutation,
	useGetCompanyCategoriesQuery,
	useUpdateCompanyCategoryMutation,
} from "@/services/api/company-categories";
import {
	useCreateProductCategoryMutation,
	useDeleteProductCategoryMutation,
	useGetProductCategoriesQuery,
	useUpdateProductCategoryMutation,
} from "@/services/api/product-categories";
import {
	useCreateServiceCategoryMutation,
	useDeleteServiceCategoryMutation,
	useGetServiceCategoriesQuery,
	useUpdateServiceCategoryMutation,
} from "@/services/api/service-categories";
import { ActionModal } from "@/shared/components/action-modal";
import { Card } from "./card";
import { CategoryCard } from "./categories/category-card";
import { PageHeader } from "./page-header";

interface CategoryCardModel {
	id: string;
	name?: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	status: string;
	icon: string;
	productCount: number;
	subcategories: any[];
}

type CategoryType = "product" | "company" | "service";

export function AdminCategoriesPage() {
	const [categoryType, setCategoryType] = useState<CategoryType>("product");
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryCardModel | null>(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [page, setPage] = useState(1);

	// Product
	const { data: productData, isLoading: loadingProduct } =
		useGetProductCategoriesQuery(
			{ page, limit: 12 },
			{ skip: categoryType !== "product" },
		);
	const [createProduct, { isLoading: creatingProduct }] =
		useCreateProductCategoryMutation();
	const [updateProduct, { isLoading: updatingProduct }] =
		useUpdateProductCategoryMutation();
	const [deleteProduct, { isLoading: deletingProduct }] =
		useDeleteProductCategoryMutation();

	// Company
	const { data: companyData, isLoading: loadingCompany } =
		useGetCompanyCategoriesQuery(
			{ page, limit: 12 },
			{ skip: categoryType !== "company" },
		);
	const [createCompany, { isLoading: creatingCompany }] =
		useCreateCompanyCategoryMutation();
	const [updateCompany, { isLoading: updatingCompany }] =
		useUpdateCompanyCategoryMutation();
	const [deleteCompany, { isLoading: deletingCompany }] =
		useDeleteCompanyCategoryMutation();

	// Service
	const { data: serviceData, isLoading: loadingService } =
		useGetServiceCategoriesQuery(
			{ page, limit: 12 },
			{ skip: categoryType !== "service" },
		);
	const [createService, { isLoading: creatingService }] =
		useCreateServiceCategoryMutation();
	const [updateService, { isLoading: updatingService }] =
		useUpdateServiceCategoryMutation();
	const [deleteService, { isLoading: deletingService }] =
		useDeleteServiceCategoryMutation();

	const isLoading =
		(categoryType === "product" && loadingProduct) ||
		(categoryType === "company" && loadingCompany) ||
		(categoryType === "service" && loadingService);

	const isCreating = creatingProduct || creatingCompany || creatingService;
	const isUpdating = updatingProduct || updatingCompany || updatingService;
	const isDeleting = deletingProduct || deletingCompany || deletingService;

	const currentData: any =
		categoryType === "product"
			? productData
			: categoryType === "company"
				? companyData
				: serviceData;

	const categories = useMemo<CategoryCardModel[]>(() => {
		return (currentData?.data || [])
			.filter((category: any) => category !== null && category !== undefined)
			.map((category: any) => ({
				id: category.id,
				name: category.name,
				description: category.description,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
				status: "active" as const,
				icon: "Settings",
				productCount: 0,
				subcategories: [],
			}));
	}, [currentData]);

	const filteredCategories = useMemo(() => {
		return categories.filter((category) =>
			(category.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [categories, searchTerm]);

	const handleEdit = (category: any) => {
		setSelectedCategory(category);
		setShowEditModal(true);
	};

	const handleDelete = (category: any) => {
		setSelectedCategory(category);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedCategory) return;
		try {
			if (categoryType === "product") {
				await deleteProduct(selectedCategory.id).unwrap();
			} else if (categoryType === "company") {
				await deleteCompany(selectedCategory.id).unwrap();
			} else {
				await deleteService(selectedCategory.id).unwrap();
			}
			setShowDeleteModal(false);
			setSelectedCategory(null);
			setDeleteConfirmation("");
		} catch (error) {
			console.error(error);
		}
	};

	const onAddSubmit = async (values: { name: string; description: string }) => {
		try {
			if (categoryType === "product") {
				await createProduct({
					name: values.name,
					description: values.description,
				}).unwrap();
			} else if (categoryType === "company") {
				await createCompany({
					name: values.name,
					description: values.description,
				}).unwrap();
			} else {
				await createService({
					name: values.name,
					description: values.description,
				}).unwrap();
			}
			setShowAddModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const onEditSubmit = async (values: {
		name: string;
		description: string;
	}) => {
		if (!selectedCategory) return;
		try {
			const data = { name: values.name, description: values.description };
			if (categoryType === "product") {
				await updateProduct({ id: selectedCategory.id, data }).unwrap();
			} else if (categoryType === "company") {
				await updateCompany({ id: selectedCategory.id, data }).unwrap();
			} else {
				await updateService({ id: selectedCategory.id, data }).unwrap();
			}
			setShowEditModal(false);
			setSelectedCategory(null);
		} catch (error) {
			console.error(error);
		}
	};

	const handleTabChange = (type: CategoryType) => {
		setCategoryType(type);
		setPage(1);
		setSearchTerm("");
	};

	return (
		<div className="space-y-5 pb-10">
			<PageHeader
				title="Categories"
				subtitle={`Manage ${categoryType} categories`}
				actions={
					<Button
						onClick={() => setShowAddModal(true)}
						className="h-11 rounded-sm px-6 font-heading font-bold uppercase text-xs tracking-wider"
					>
						<RiAddLine size={18} className="mr-2" />
						Add Category
					</Button>
				}
			/>

			<div className="flex bg-muted p-1 rounded-sm w-fit border border-border">
				<Button
					variant={categoryType === "product" ? "default" : "ghost"}
					onClick={() => handleTabChange("product")}
					className="font-bold uppercase tracking-wider text-[10px] shadow-none w-32 rounded-[2px]"
				>
					Products
				</Button>
				<Button
					variant={categoryType === "company" ? "default" : "ghost"}
					onClick={() => handleTabChange("company")}
					className="font-bold uppercase tracking-wider text-[10px] shadow-none w-32 rounded-[2px]"
				>
					Companies
				</Button>
				<Button
					variant={categoryType === "service" ? "default" : "ghost"}
					onClick={() => handleTabChange("service")}
					className="font-bold uppercase tracking-wider text-[10px] shadow-none w-32 rounded-[2px]"
				>
					Services
				</Button>
			</div>

			<Card noPadding>
				<div className="p-3">
					<div className="relative">
						<RiSearchLine
							className="absolute left-3 top-3 text-muted-foreground"
							size={18}
						/>
						<input
							type="text"
							placeholder={`Search ${categoryType} categories...`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="h-11 w-full rounded-sm border border-border bg-background py-2 pr-4 pl-10 text-sm focus:outline-none focus:border-primary/50"
						/>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
				{isLoading ? (
					<div className="col-span-full flex justify-center p-12">
						<RiLoader2Line className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
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
									We couldn't find any {categoryType} categories matching your
									search.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</div>
				) : (
					filteredCategories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category as any}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))
				)}
			</div>

			{currentData?.meta && currentData.meta.totalPages > 1 && (
				<div className="flex justify-center gap-2 mt-8 pt-6 border-t border-border">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => setPage((p) => p - 1)}
						className="rounded-sm h-10 px-6 font-bold uppercase text-[10px] tracking-widest"
					>
						Previous
					</Button>
					<span className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
						Page {page} of {currentData.meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= currentData.meta.totalPages}
						onClick={() => setPage((p) => p + 1)}
						className="rounded-sm h-10 px-6 font-bold uppercase text-[10px] tracking-widest"
					>
						Next
					</Button>
				</div>
			)}

			<ActionModal
				isOpen={showAddModal}
				type="info"
				title={`Add ${categoryType} Category`}
				description={`Create a new ${categoryType} category`}
				onCancel={() => setShowAddModal(false)}
				showFooter={false}
			>
				<CategoryForm
					mode="add"
					onSubmit={onAddSubmit}
					onCancel={() => setShowAddModal(false)}
				/>
			</ActionModal>

			<ActionModal
				isOpen={showEditModal}
				type="info"
				title={`Edit ${categoryType} Category`}
				description="Update category details"
				onCancel={() => setShowEditModal(false)}
				showFooter={false}
			>
				{selectedCategory && (
					<CategoryForm
						mode="edit"
						initialValues={{
							name: selectedCategory.name ?? "",
							description: selectedCategory.description || "",
						}}
						onSubmit={onEditSubmit}
						onCancel={() => setShowEditModal(false)}
					/>
				)}
			</ActionModal>

			<ActionModal
				isOpen={showDeleteModal}
				type="delete"
				title={`Delete ${categoryType} Category`}
				description={`Delete "${selectedCategory?.name ?? ""}"?`}
				message="Type the category name to confirm."
				inputLabel="Confirmation"
				inputPlaceholder={selectedCategory?.name}
				inputValue={deleteConfirmation}
				onInputChange={setDeleteConfirmation}
				onCancel={() => {
					setShowDeleteModal(false);
					setDeleteConfirmation("");
					setSelectedCategory(null);
				}}
				onConfirm={handleConfirmDelete}
				confirmText={isDeleting ? "Deleting..." : "Delete"}
				cancelText="Cancel"
				isDisabled={
					isDeleting ||
					deleteConfirmation.toLowerCase() !==
						(selectedCategory?.name ?? "").toLowerCase()
				}
			/>

			{(isCreating || isUpdating) && (
				<div className="text-sm text-muted-foreground">Saving changes...</div>
			)}
		</div>
	);
}
