import { apiSlice } from "@/services/api/api-entry";
import { unwrapListResponse, unwrapResponse } from "@/services/api/utils";
import type {
	ApiResponse,
	ServiceCategoriesListResult,
	ServiceCategory,
} from "@/types";

export const serviceCategoriesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getServiceCategories: builder.query<
			ServiceCategoriesListResult,
			{ page?: number; limit?: number }
		>({
			query: (params = {}) => {
				const sp = new URLSearchParams();
				if (params?.page != null) sp.set("page", String(params.page));
				if (params?.limit != null) sp.set("limit", String(params.limit));
				return `/service-categories?${sp.toString()}`;
			},
			transformResponse: (response: ApiResponse<ServiceCategory[]>) =>
				unwrapListResponse(response) as ServiceCategoriesListResult,
			providesTags: ["Categories"],
		}),

		getServiceCategoryById: builder.query<ServiceCategory | null, string>({
			query: (id) => `/service-categories/${id}`,
			transformResponse: (response: ApiResponse<ServiceCategory>) =>
				unwrapResponse(response),
			providesTags: (_result, _err, id) => [{ type: "Categories", id }],
		}),
		createServiceCategory: builder.mutation<
			ServiceCategory,
			{ name: string; description?: string }
		>({
			query: (body) => ({
				url: "/service-categories",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Categories"],
		}),

		updateServiceCategory: builder.mutation<
			ServiceCategory,
			{ id: string; data: { name?: string; description?: string } }
		>({
			query: ({ id, data }) => ({
				url: `/service-categories/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_result, _err, { id }) => [
				{ type: "Categories", id },
				"Categories",
			],
		}),

		deleteServiceCategory: builder.mutation<void, string>({
			query: (id) => ({
				url: `/service-categories/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Categories"],
		}),
	}),
});

export const {
	useGetServiceCategoriesQuery,
	useGetServiceCategoryByIdQuery,
	useCreateServiceCategoryMutation,
	useUpdateServiceCategoryMutation,
	useDeleteServiceCategoryMutation,
} = serviceCategoriesApi;
