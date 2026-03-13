import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/services/api/api-entry";
import { unwrapListResponse, unwrapResponse } from "@/services/api/utils";
import type {
  ApiResponse,
  CreateServiceInput,
  Service,
  ServicesListResult,
  ServicesQueryParams,
} from "@/types";
import type { RootState } from "@/store";

export interface NormalizedServicesResult extends ServicesListResult {
  byId: Record<string, Service>;
}

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<NormalizedServicesResult, ServicesQueryParams>({
      query: (params) => ({ url: "/services", params }),
      transformResponse: (response: ApiResponse<Service[]>) => {
        const res = unwrapListResponse(response) as ServicesListResult;
        const byId: Record<string, Service> = {};
        for (const item of res.data) {
          byId[item.id] = item;
        }
        return { ...res, byId };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Services" as const,
                id,
              })),
              { type: "Services", id: "LIST" },
            ]
          : [{ type: "Services", id: "LIST" }],
    }),

    getServiceById: builder.query<Service | null, string>({
      query: (id) => `/services/${id}`,
      transformResponse: (response: ApiResponse<Service>) =>
        unwrapResponse(response),
      providesTags: (_result, _err, id) => [{ type: "Services", id }],
    }),

    createService: builder.mutation<Service, CreateServiceInput>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    updateService: builder.mutation<
      Service,
      { id: string; data: Partial<CreateServiceInput> }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;

const EMPTY_ARRAY: Service[] = [];
const EMPTY_OBJECT: Record<string, unknown> = {};

const selectServicesResult = (state: RootState, params: ServicesQueryParams) =>
  servicesApi.endpoints.getServices.select(params)(state);

export const selectServicesData = createSelector(
  [selectServicesResult],
  (result) => result.data?.data ?? EMPTY_ARRAY,
);

export const selectServicesMeta = createSelector(
  [selectServicesResult],
  (result) => result.data?.meta ?? EMPTY_OBJECT,
);

export const selectServiceById = createSelector(
  [selectServicesResult, (_state, _params, id: string) => id],
  (result, id) => result.data?.byId?.[id],
);
