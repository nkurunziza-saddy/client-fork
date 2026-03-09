import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/services/api/api-entry";
import type {
  ApiResponse,
  CompaniesListResult,
  CompaniesQueryParams,
  Company,
  CreateCompanyInput,
} from "@/types";

export const companiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<CompaniesListResult, CompaniesQueryParams>({
      query: (params = {}) => {
        const sp = new URLSearchParams();
        if (params?.page != null) sp.set("page", String(params.page));
        if (params?.limit != null) sp.set("limit", String(params.limit));
        if (params?.query) sp.set("query", params.query);
        if (params?.categoryId) sp.set("categoryId", params.categoryId);
        if (params?.district) sp.set("district", params.district);
        if (params?.type) sp.set("type", params.type);
        if (params?.sortBy) sp.set("sortBy", params.sortBy);
        if (params?.sortOrder) sp.set("sortOrder", params.sortOrder);
        if (params?.minRating) sp.set("minRating", String(params.minRating));
        if (params?.isVerified) sp.set("isVerified", String(true));
        return `/companies?${sp.toString()}`;
      },
      transformResponse: (response: ApiResponse<Company[]>) => {
        const m = response.meta;
        return {
          data: response.data ?? [],
          meta: {
            total: m?.total ?? 0,
            page: m?.page ?? 1,
            limit: m?.limit ?? 10,
            totalPages: m?.totalPages ?? 0,
          },
        };
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
        response.data ?? null,
      providesTags: (_result, _err, id) => [{ type: "Suppliers", id }],
    }),

    getMyCompany: builder.query<Company | null, void>({
      query: () => "/companies/my",
      transformResponse: (response: ApiResponse<Company>) =>
        response.data ?? null,
      providesTags: ["Suppliers"],
    }),

    createCompany: builder.mutation<Company, CreateCompanyInput>({
      query: (body) => ({
        url: "/companies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Suppliers", { type: "Suppliers", id: "LIST" }],
    }),

    updateCompany: builder.mutation<
      Company,
      { id: string; data: Partial<CreateCompanyInput> }
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
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Suppliers", id: "LIST" }],
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
} = companiesApi;

const selectCompaniesResult = (result: CompaniesListResult | undefined) =>
  result;

export const selectCompaniesData = createSelector(
  [selectCompaniesResult],
  (result) => result?.data ?? [],
);

export const selectCompaniesMeta = createSelector(
  [selectCompaniesResult],
  (result) => result?.meta,
);
