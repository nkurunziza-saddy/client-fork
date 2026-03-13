import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/services/api/api-entry";
import { unwrapListResponse, unwrapResponse } from "@/services/api/utils";
import type {
	ApiResponse,
	CreateProductInput,
	CreateProductVariantInput,
	Product,
	ProductsListResult,
	ProductsQueryParams,
} from "@/types";

function buildProductsQuery(params: ProductsQueryParams): string {
	const sp = new URLSearchParams();
	if (params.page != null) sp.set("page", String(params.page));
	if (params.limit != null) sp.set("limit", String(params.limit));
	if (params.query) sp.set("query", params.query);
	if (params.categoryId && params.categoryId !== "all")
		sp.set("categoryId", params.categoryId);
	if (params.companyId) sp.set("companyId", params.companyId);
	if (params.district) sp.set("district", params.district);
	if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
	if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
	if (params.inStock != null) sp.set("inStock", String(params.inStock));
	if (params.companyType) sp.set("companyType", params.companyType);
	if (params.isFeatured != null)
		sp.set("isFeatured", String(params.isFeatured));
	if (params.hasDiscount != null)
		sp.set("hasDiscount", String(params.hasDiscount));
	if (params.sortBy) sp.set("sortBy", params.sortBy);
	if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
	return `/products?${sp.toString()}`;
}

export interface NormalizedProductsResult extends ProductsListResult {
	byId: Record<string, Product>;
}

export const productsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query<NormalizedProductsResult, ProductsQueryParams>({
			query: (params = {}) => buildProductsQuery(params as ProductsQueryParams),
			transformResponse: (response: ApiResponse<Product[]>) => {
				const res = unwrapListResponse(response) as ProductsListResult;
				const byId: Record<string, Product> = {};
				for (const item of res.data) {
					byId[item.id] = item;
				}
				return { ...res, byId };
			},
			providesTags: (result) =>
				result
					? [
							...result.data.map(({ id }) => ({
								type: "Products" as const,
								id,
							})),
							{ type: "Products", id: "LIST" },
						]
					: [{ type: "Products", id: "LIST" }],
		}),

		getProductById: builder.query<Product | null, string>({
			query: (id) => `/products/${id}`,
			transformResponse: (response: ApiResponse<Product>) =>
				unwrapResponse(response),
			providesTags: (_result, _err, id) => [{ type: "Products", id }],
		}),

		createProduct: builder.mutation<Product, CreateProductInput>({
			query: (body) => ({ url: "/products", method: "POST", body }),
			invalidatesTags: [{ type: "Products", id: "LIST" }],
		}),

		updateProduct: builder.mutation<
			Product,
			{ id: string; data: Partial<CreateProductInput> }
		>({
			query: ({ id, data }) => ({
				url: `/products/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_result, _err, { id }) => [
				{ type: "Products", id },
				{ type: "Products", id: "LIST" },
			],
		}),

		deleteProduct: builder.mutation<void, string>({
			query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
			invalidatesTags: [{ type: "Products", id: "LIST" }],
		}),

		addProductVariant: builder.mutation<
			unknown,
			{ productId: string; data: CreateProductVariantInput }
		>({
			query: ({ productId, data }) => ({
				url: `/products/${productId}/variants`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: (_result, _err, { productId }) => [
				{ type: "Products", id: productId },
				{ type: "Products", id: "LIST" },
			],
		}),

		removeProductVariant: builder.mutation<void, string>({
			query: (variantId) => ({
				url: `/products/variants/${variantId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "Products", id: "LIST" }],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductByIdQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useAddProductVariantMutation,
	useRemoveProductVariantMutation,
} = productsApi;

const EMPTY_ARRAY: any[] = [];
const EMPTY_OBJECT: any = {};

const selectProductsResult = (state: any, params: ProductsQueryParams) => 
	productsApi.endpoints.getProducts.select(params)(state);

export const selectProductsData = createSelector(
	[selectProductsResult],
	(result) => result.data?.data ?? EMPTY_ARRAY,
);

export const selectProductsMeta = createSelector(
	[selectProductsResult],
	(result) => result.data?.meta ?? EMPTY_OBJECT,
);

export const selectProductById = createSelector(
	[selectProductsResult, (_state, _params, id: string) => id],
	(result, id) => result.data?.byId?.[id],
);
