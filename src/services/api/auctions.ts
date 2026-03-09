import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/services/api/api-entry";
import { unwrapListResponse, unwrapResponse } from "@/services/api/utils";
import type {
  ApiResponse,
  Auction,
  AuctionStatus,
  AuctionsListResult,
  AuctionsQueryParams,
  CreateAuctionInput,
} from "@/types";

function buildAuctionsQuery(params: AuctionsQueryParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status) sp.set("status", params.status);
  if (params.companyId) sp.set("companyId", params.companyId);
  if (params.searchQuery) sp.set("searchQuery", params.searchQuery);
  if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
  return `/auctions?${sp.toString()}`;
}

export const auctionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query<AuctionsListResult, AuctionsQueryParams>({
      query: (params = {}) => buildAuctionsQuery(params),
      transformResponse: (response: ApiResponse<Auction[]>) =>
        unwrapListResponse(response) as AuctionsListResult,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Auctions" as const,
                id,
              })),
              { type: "Auctions", id: "LIST" },
            ]
          : [{ type: "Auctions", id: "LIST" }],
    }),

    getAuctionById: builder.query<Auction | null, string>({
      query: (id) => `/auctions/${id}`,
      transformResponse: (response: ApiResponse<Auction>) =>
        unwrapResponse(response),
      providesTags: (_result, _err, id) => [{ type: "Auctions", id }],
    }),

    createAuction: builder.mutation<Auction, CreateAuctionInput>({
      query: (body) => ({ url: "/auctions", method: "POST", body }),
      invalidatesTags: [{ type: "Auctions", id: "LIST" }],
    }),

    updateAuction: builder.mutation<
      Auction,
      { id: string; data: Partial<CreateAuctionInput> }
    >({
      query: ({ id, data }) => ({
        url: `/auctions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Auctions", id },
        { type: "Auctions", id: "LIST" },
      ],
    }),

    deleteAuction: builder.mutation<void, string>({
      query: (id) => ({ url: `/auctions/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Auctions", id: "LIST" }],
    }),

    updateAuctionStatus: builder.mutation<
      Auction,
      { id: string; status: AuctionStatus }
    >({
      query: ({ id, status }) => ({
        url: `/auctions/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Auctions", id },
        { type: "Auctions", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionByIdQuery,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useDeleteAuctionMutation,
  useUpdateAuctionStatusMutation,
} = auctionsApi;

const selectAuctionsResult = (result: AuctionsListResult | undefined) => result;

export const selectAuctionsData = createSelector(
  [selectAuctionsResult],
  (result) => result?.data ?? [],
);

export const selectAuctionsMeta = createSelector(
  [selectAuctionsResult],
  (result) => result?.meta,
);
