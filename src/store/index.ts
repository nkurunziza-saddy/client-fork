import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	persistReducer,
	persistStore,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "@/services/api/api-entry";
import authReducer from "@/store/slices/auth-slice";

const authPersistConfig = {
	key: "auth",
	storage,
	whitelist: ["isAuthenticated", "user", "token"],
};

const apiPersistConfig = {
	key: "api",
	storage,
};

export const persistedAuthReducer = persistReducer(
	authPersistConfig,
	authReducer,
);

export const persistedApiReducer = persistReducer(
	apiPersistConfig,
	apiSlice.reducer,
);

const rootReducer = combineReducers({
	auth: persistedAuthReducer,
	[apiSlice.reducerPath]: persistedApiReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				warnAfter: 256,
			},
			immutableCheck: {
				warnAfter: 256,
			},
		}).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
