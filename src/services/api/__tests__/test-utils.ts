import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { afterEach, vi } from "vitest";

import { apiSlice } from "@/services/api/api-entry";
import authReducer, { setToken, setUser } from "@/store/slices/auth-slice";
import type { AuthUser } from "@/types";

interface CaptureRequest {
  url: string;
  path: string;
  method: string;
  headers: Headers;
  rawBody: string;
  jsonBody: unknown;
}

interface MockInstallResult {
  requests: CaptureRequest[];
  fetchMock: ReturnType<typeof vi.fn>;
}

export function createApiTestStore(opts?: { token?: string; user?: AuthUser }) {
  const store = configureStore({
    reducer: combineReducers({
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  if (opts?.user) {
    store.dispatch(setUser(opts.user));
  }
  if (opts?.token) {
    store.dispatch(setToken(opts.token));
  }

  return store;
}

export function installFetchMock(
  responder: (req: Request, idx: number) => Promise<Response> | Response,
): MockInstallResult {
  const requests: CaptureRequest[] = [];

  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const req = new Request(input, init);
      const rawBody = await req.clone().text();
      let jsonBody: unknown;

      if (rawBody.length > 0) {
        try {
          jsonBody = JSON.parse(rawBody);
        } catch {
          jsonBody = rawBody;
        }
      }

      const url = new URL(req.url);
      requests.push({
        url: req.url,
        path: `${url.pathname}${url.search}`,
        method: req.method,
        headers: new Headers(req.headers),
        rawBody,
        jsonBody,
      });

      return responder(req, requests.length - 1);
    },
  );

  // works in both Bun and Vitest
  globalThis.fetch = fetchMock;

  return { requests, fetchMock };
}

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});
