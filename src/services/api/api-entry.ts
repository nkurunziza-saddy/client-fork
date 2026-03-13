import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";
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
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === REHYDRATE) {
			return (action.payload as any)?.[reducerPath];
		}
	},
	// Global TTL: How long to keep unused data in the cache (5 minutes)
	keepUnusedDataFor: 300,
	// SWR config: Consider data stale after 30 seconds. 
	// If mount occurs after 30s, fresh data is fetched in background while cached is returned immediately.
	refetchOnMountOrArgChange: 30,
	refetchOnReconnect: true,
	refetchOnFocus: true,
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
