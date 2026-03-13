import { apiSlice } from "@/services/api/api-entry";
import type {
	ApiResponse,
	PaginatedMeta,
	UpdateProfileInput,
	UserProfile,
} from "@/types";

export const usersApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<UserProfile, void>({
			query: () => "/users/me/profile",
			transformResponse: (response: ApiResponse<UserProfile>) =>
				(response as ApiResponse<UserProfile>)?.data ??
				(response as unknown as UserProfile),
			providesTags: ["Users", "Session"],
		}),

		updateProfile: builder.mutation<
			UserProfile,
			{ id: string; data: UpdateProfileInput }
		>({
			query: ({ id, data }) => ({
				url: `/users/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["Users", "Session"],
		}),
		getUsers: builder.query<
			{ data: UserProfile[]; meta: PaginatedMeta },
			{ page?: number; limit?: number }
		>({
			query: ({ page = 1, limit = 20 }) => `/users?page=${page}&limit=${limit}`,
			transformResponse: (
				response: ApiResponse<UserProfile[]>,
			): { data: UserProfile[]; meta: PaginatedMeta } => {
				const data = Array.isArray(response.data) ? response.data : [];
				const meta = response.meta ?? {};
				return {
					data,
					meta: {
						total: meta.total ?? data.length,
						page: meta.page ?? 1,
						limit: meta.limit ?? 20,
						totalPages: meta.totalPages ?? 0,
					},
				};
			},
			providesTags: ["Users"],
		}),
		getUserById: builder.query<UserProfile, string>({
			query: (id) => `/users/${id}`,
			providesTags: (_r, _e, id) => [{ type: "Users", id }],
		}),
		deleteUser: builder.mutation<void, string>({
			query: (id) => ({
				url: `/users/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Users"],
		}),

		checkEmail: builder.query<{ available: boolean }, string>({
			query: (email) => `/users/check-email?email=${encodeURIComponent(email)}`,
			transformResponse: (response: ApiResponse<{ available: boolean }>) =>
				response.data ?? { available: true },
		}),

		checkPhone: builder.query<{ available: boolean }, string>({
			query: (phoneNumber) =>
				`/users/check-registration?phoneNumber=${encodeURIComponent(phoneNumber)}`,
			transformResponse: (response: ApiResponse<{ available: boolean }>) =>
				response.data ?? { available: true },
		}),
	}),
});

export const {
	useGetProfileQuery,
	useUpdateProfileMutation,
	useGetUsersQuery,
	useGetUserByIdQuery,
	useDeleteUserMutation,
	useLazyCheckEmailQuery,
	useLazyCheckPhoneQuery,
} = usersApi;
