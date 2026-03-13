import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render as rtlRender } from "@testing-library/react";
import type React from "react";
import { Provider } from "react-redux";
import { apiSlice } from "@/services/api/api-entry";
import authReducer from "@/store/slices/auth-slice";

export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState = {},
		store = configureStore({
			reducer: combineReducers({
				auth: authReducer,
				[apiSlice.reducerPath]: apiSlice.reducer,
			}),
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware({
					serializableCheck: false,
				}).concat(apiSlice.middleware),
			preloadedState,
		}),
		...renderOptions
	} = {},
) {
	function Wrapper({ children }: { children: React.ReactNode }) {
		return <Provider store={store}>{children}</Provider>;
	}
	return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from RTL
export * from "@testing-library/react";
