import { apiSlice } from "@/services/api/api-entry";
import type { ApiResponse, WishlistItem, WishlistResponse } from "@/types";

export const wishlistApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getWishlist: builder.query<WishlistItem[], void>({
			query: () => "/wishlists",
			transformResponse: (
				response: ApiResponse<WishlistResponse>,
			): WishlistItem[] => {
				const data = response.data;
				if (!data) return [];

				const products = (data.products || []).map((p) => ({
					...p,
					type: "product" as const,
					itemType: "PRODUCT" as const,
				})) as WishlistItem[];
				const services = (data.services || []).map((s) => ({
					...s,
					type: "service" as const,
					itemType: "SERVICE" as const,
				})) as WishlistItem[];

				return ([...products, ...services] as any[]).sort((a, b) => {
					return (
						new Date(b.createdAt || 0).getTime() -
						new Date(a.createdAt || 0).getTime()
					);
				});
			},
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: "Wishlist" as const, id })),
							{ type: "Wishlist", id: "LIST" },
						]
					: [{ type: "Wishlist", id: "LIST" }],
		}),

		checkProductWishlist: builder.query<{ inWishlist: boolean }, string>({
			query: (productId) => `/wishlists/products/${productId}/check`,
			providesTags: (_r, _e, id) => [{ type: "Wishlist", id }],
		}),

		checkServiceWishlist: builder.query<{ inWishlist: boolean }, string>({
			query: (serviceId) => `/wishlists/services/${serviceId}/check`,
			providesTags: (_r, _e, id) => [{ type: "Wishlist", id }],
		}),

		addToWishlist: builder.mutation<
			unknown,
			{ id: string; type: "product" | "service" | "auction" }
		>({
			query: ({ id, type }) => ({
				url: `/wishlists/${type}s`,
				method: "POST",
				body: type === "product" ? { productId: id } : { serviceId: id },
			}),
			async onQueryStarted({ id, type }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					wishlistApi.util.updateQueryData(
						"getWishlist",
						undefined,
						(draft) => {
							draft.unshift({
								id,
								type,
								createdAt: new Date().toISOString(),
							} as WishlistItem);
						},
					),
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: (_result, _err, { id }) => [
				{ type: "Wishlist", id },
				{ type: "Wishlist", id: "LIST" },
			],
		}),

		removeFromWishlist: builder.mutation<
			void,
			{ id: string; type: "product" | "service" | "auction" }
		>({
			query: ({ id, type }) => ({
				url: `/wishlists/${type}s/${id}`,
				method: "DELETE",
			}),
			async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					wishlistApi.util.updateQueryData(
						"getWishlist",
						undefined,
						(draft) => {
							return draft.filter((item) => item.id !== id);
						},
					),
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: (_result, _err, { id }) => [
				{ type: "Wishlist", id },
				{ type: "Wishlist", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetWishlistQuery,
	useCheckProductWishlistQuery,
	useCheckServiceWishlistQuery,
	useAddToWishlistMutation,
	useRemoveFromWishlistMutation,
} = wishlistApi;
