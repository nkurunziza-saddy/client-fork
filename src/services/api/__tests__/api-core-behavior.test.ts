import { describe, expect, it } from "vitest";

import { apiSlice } from "@/services/api/api-entry";
import { authApi } from "@/services/api/auth";
import { messagesApi } from "@/services/api/messages";
import { reviewsApi } from "@/services/api/reviews";
import { usersApi } from "@/services/api/users";
import { wishlistApi } from "@/services/api/wishlist";

import {
	createApiTestStore,
	installFetchMock,
	jsonResponse,
} from "./test-utils";

function findRequest(
	requests: Array<{ path: string; method: string; jsonBody: unknown }>,
	path: string,
	method?: string,
) {
	return requests.find((request) => {
		const pathMatches = request.path === path;
		const methodMatches = method ? request.method === method : true;
		return pathMatches && methodMatches;
	});
}

describe("api core behavior", () => {
	it("adds auth/content headers and logs out on 401", async () => {
		const store = createApiTestStore({
			token: "token-123",
			user: {
				id: "u1",
				email: "me@example.com",
				name: "Me",
				role: "user",
			},
		});

		const { requests } = installFetchMock((_req, idx) => {
			if (idx === 0) {
				return jsonResponse({ data: { ok: true } });
			}
			return jsonResponse({ message: "Unauthorized" }, { status: 401 });
		});

		await store.dispatch(authApi.endpoints.getSession.initiate()).unwrap();
		expect(requests[0].headers.get("authorization")).toBe("Bearer token-123");
		expect(requests[0].headers.get("content-type")).toContain(
			"application/json",
		);

		await store.dispatch(
			authApi.endpoints.getSession.initiate(undefined, { forceRefetch: true }),
		);

		const state = store.getState();
		expect(state.auth.token).toBeNull();
		expect(state.auth.user).toBeNull();
		expect(state.auth.isAuthenticated).toBe(false);
	});

	it("unwraps auth payload and prefers header token when available", async () => {
		const store = createApiTestStore();
		installFetchMock(() =>
			jsonResponse(
				{
					data: {
						user: { id: "u1", email: "a@b.com", name: "A", role: "user" },
						token: "body-token",
					},
				},
				{ headers: { "set-auth-token": "header-token" } },
			),
		);

		const data = await store
			.dispatch(
				authApi.endpoints.signIn.initiate({
					email: "a@b.com",
					password: "secret",
				}),
			)
			.unwrap();

		expect(data.token).toBe("header-token");
		expect(data.user.id).toBe("u1");
	});

	it("uses session token fallback for sign up when header token is missing", async () => {
		const store = createApiTestStore();
		installFetchMock(() =>
			jsonResponse({
				data: {
					user: {
						id: "u2",
						email: "new@example.com",
						name: "New",
						role: "provider",
					},
					session: { token: "session-token" },
				},
			}),
		);

		const data = await store
			.dispatch(
				authApi.endpoints.signUp.initiate({
					name: "New",
					email: "new@example.com",
					password: "pw",
					role: "provider",
				}),
			)
			.unwrap();

		expect(data.token).toBe("session-token");
	});

	it("normalizes messages responses and sends expected payloads", async () => {
		const store = createApiTestStore();
		const { requests } = installFetchMock((_req, idx) => {
			if (idx === 0) {
				return jsonResponse({
					data: [
						{
							partner: { id: "u2", name: "A", email: "a@x.com" },
							lastMessage: "hi",
							lastMessageAt: "2026-01-01",
						},
					],
				});
			}
			if (idx === 1) {
				return jsonResponse({
					data: [
						{
							id: "m1",
							content: "hello",
							sender: { id: "u1", name: "Me", email: "m@x.com" },
							receiver: { id: "u2", name: "You", email: "y@x.com" },
							createdAt: "2026-01-01",
						},
					],
					meta: { total: 1, page: 2, limit: 20, totalPages: 1 },
				});
			}
			return jsonResponse({ data: { ok: true } });
		});

		const conversations = await store
			.dispatch(messagesApi.endpoints.getConversations.initiate())
			.unwrap();
		const history = await store
			.dispatch(
				messagesApi.endpoints.getChatHistory.initiate({
					partnerId: "u2",
					page: 2,
					limit: 20,
				}),
			)
			.unwrap();
		await store
			.dispatch(
				messagesApi.endpoints.sendMessage.initiate({
					receiverId: "u2",
					content: "hello",
					productId: "l1",
				}),
			)
			.unwrap();

		expect(conversations).toHaveLength(1);
		expect(history).toEqual({
			items: expect.any(Array),
			meta: {
				total: 1,
				page: 2,
				limit: 20,
				totalPages: 1,
			},
		});
		expect(
			findRequest(requests, "/api/messages/history/u2?page=2&limit=20", "GET"),
		).toBeTruthy();
		expect(findRequest(requests, "/api/messages", "POST")?.jsonBody).toEqual({
			receiverId: "u2",
			content: "hello",
			productId: "l1",
		});
	});

	it("merges and sorts wishlist data and sends add/remove payloads", async () => {
		const store = createApiTestStore();
		const { requests } = installFetchMock((_req, idx) => {
			if (idx === 0) {
				return jsonResponse({
					data: {
						products: [{ id: "p1", createdAt: "2026-01-03" }],
						services: [{ id: "s1", createdAt: "2026-01-01" }],
					},
				});
			}
			return jsonResponse({ data: { ok: true } });
		});

		const list = await store
			.dispatch(wishlistApi.endpoints.getWishlist.initiate())
			.unwrap();
		await store
			.dispatch(
				wishlistApi.endpoints.addToWishlist.initiate({
					id: "p1",
					type: "product",
				}),
			)
			.unwrap();
		await store
			.dispatch(
				wishlistApi.endpoints.removeFromWishlist.initiate({
					id: "s1",
					type: "service",
				}),
			)
			.unwrap();

		expect(list.map((item) => item.id)).toEqual(["p1", "s1"]);
		expect(list[0].type).toBe("product");
		expect(
			findRequest(requests, "/api/wishlists/products", "POST")?.jsonBody,
		).toEqual({ productId: "p1" });
		expect(
			findRequest(requests, "/api/wishlists/services/s1", "DELETE"),
		).toBeTruthy();
	});

	it("keeps review and profile mutations aligned with API contract", async () => {
		const store = createApiTestStore();
		const { requests } = installFetchMock((_req, idx) => {
			if (idx === 0) {
				return jsonResponse({
					data: {
						id: "u1",
						name: "Name",
						email: "name@example.com",
						role: "user",
					},
				});
			}
			return jsonResponse({ data: { ok: true } });
		});

		const profile = await store
			.dispatch(usersApi.endpoints.getProfile.initiate())
			.unwrap();
		await store
			.dispatch(
				usersApi.endpoints.updateProfile.initiate({
					id: "u1",
					data: { name: "Updated" },
				}),
			)
			.unwrap();
		await store
			.dispatch(
				reviewsApi.endpoints.createReview.initiate({
					rating: 5,
					comment: "Great",
					productId: "l1",
				}),
			)
			.unwrap();

		expect(profile.id).toBe("u1");
		expect(findRequest(requests, "/api/users/u1", "PATCH")?.jsonBody).toEqual({
			name: "Updated",
		});
		expect(findRequest(requests, "/api/reviews", "POST")?.jsonBody).toEqual({
			rating: 5,
			comment: "Great",
			productId: "l1",
		});
	});

	it("can reset API state between test runs", async () => {
		const store = createApiTestStore();
		store.dispatch(apiSlice.util.resetApiState());
		expect(store.getState().api.queries).toEqual({});
	});
});
