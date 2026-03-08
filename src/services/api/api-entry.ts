import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiUrl } from "@/shared/config/env";
import type { RootState } from "@/store";
import { logout } from "@/store/slices/auth-slice";

const BASE_URL = getApiUrl();

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const state = (getState as () => RootState)();
		const token = state.auth.token;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		headers.set("Content-Type", "application/json");
		return headers;
	},
	credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	keepUnusedDataFor: 300,
	refetchOnMountOrArgChange: 120,
	refetchOnReconnect: true,
	tagTypes: [
		"Users",
		"Categories",
		"Products",
		"Services",
		"Suppliers",
		"Customers",
		"Orders",
		"Dashboard",
		"Session",
		"Wishlist",
		"Messages",
		"Stats",
		"Reviews",
		"Auctions",
	],
	endpoints: () => ({}),
});
