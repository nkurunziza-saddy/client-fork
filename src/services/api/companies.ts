import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/services/api/api-entry";
import { unwrapListResponse, unwrapResponse } from "@/services/api/utils";
import type {
	ApiResponse,
	CompaniesListResult,
	CompaniesQueryParams,
	Company,
	CreateCompanyInput,
} from "@/types";

export interface NormalizedCompaniesResult extends CompaniesListResult {
	byId: Record<string, Company>;
}

export const companiesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query<NormalizedCompaniesResult, CompaniesQueryParams>({
			query: (params) => {
				const filteredParams: any = { ...params };
				if (filteredParams.isVerified === false) delete filteredParams.isVerified;
				return { url: "/companies", params: filteredParams };
			},
			transformResponse: (response: ApiResponse<Company[]>) => {
				const res = unwrapListResponse(response) as CompaniesListResult;
				const byId: Record<string, Company> = {};
				for (const item of res.data) {
					byId[item.id] = item;
				}
				return { ...res, byId };
			},
			providesTags: (result) =>
				result
					? [
							...result.data.map(({ id }) => ({
								type: "Suppliers" as const,
								id,
							})),
							{ type: "Suppliers", id: "LIST" },
						]
					: [{ type: "Suppliers", id: "LIST" }],
		}),

		getCompanyById: builder.query<Company | null, string>({
			query: (id) => `/companies/${id}`,
			transformResponse: (response: ApiResponse<Company>) =>
				unwrapResponse(response),
			providesTags: (_result, _err, id) => [{ type: "Suppliers", id }],
		}),

		getMyCompany: builder.query<Company | null, void>({
			query: () => "/companies/my-company",
			transformResponse: (response: ApiResponse<Company>) =>
				unwrapResponse(response),
			providesTags: (result) =>
				result ? [{ type: "Suppliers", id: result.id }] : [],
		}),

		createCompany: builder.mutation<Company, CreateCompanyInput>({
			query: (body) => ({ url: "/companies", method: "POST", body }),
			invalidatesTags: [{ type: "Suppliers", id: "LIST" }],
		}),

		updateCompany: builder.mutation<
			Company,
			{ id: string; data: Partial<CreateCompanyInput & { isActive: boolean }> }
		>({
			query: ({ id, data }) => ({
				url: `/companies/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_result, _err, { id }) => [
				{ type: "Suppliers", id },
				{ type: "Suppliers", id: "LIST" },
			],
		}),

		deleteCompany: builder.mutation<void, string>({
			query: (id) => ({ url: `/companies/${id}`, method: "DELETE" }),
			invalidatesTags: [{ type: "Suppliers", id: "LIST" }],
		}),

		checkEmail: builder.query<{ available: boolean }, string>({
			query: (email) => `/companies/check-email?email=${email}`,
		}),

		checkPhone: builder.query<{ available: boolean }, string>({
			query: (phone) => `/companies/check-phone?phone=${phone}`,
		}),

		checkCompanyName: builder.query<{ available: boolean }, string>({
			query: (name) => `/companies/check-name?name=${name}`,
		}),

		checkCompanySlug: builder.query<{ available: boolean }, string>({
			query: (slug) => `/companies/check-slug?slug=${slug}`,
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useGetCompanyByIdQuery,
	useGetMyCompanyQuery,
	useCreateCompanyMutation,
	useUpdateCompanyMutation,
	useDeleteCompanyMutation,
	useCheckEmailQuery,
	useCheckPhoneQuery,
	useCheckCompanyNameQuery,
	useCheckCompanySlugQuery,
	useLazyCheckEmailQuery,
	useLazyCheckPhoneQuery,
	useLazyCheckCompanyNameQuery,
	useLazyCheckCompanySlugQuery,
} = companiesApi;

const EMPTY_ARRAY: any[] = [];
const EMPTY_OBJECT: any = {};

const selectCompaniesResult = (state: any, params: CompaniesQueryParams) => 
	companiesApi.endpoints.getCompanies.select(params)(state);

export const selectCompaniesData = createSelector(
	[selectCompaniesResult],
	(result) => result.data?.data ?? EMPTY_ARRAY,
);

export const selectCompaniesMeta = createSelector(
	[selectCompaniesResult],
	(result) => result.data?.meta ?? EMPTY_OBJECT,
);

export const selectCompanyById = createSelector(
	[selectCompaniesResult, (_state, _params, id: string) => id],
	(result, id) => result.data?.byId?.[id],
);
