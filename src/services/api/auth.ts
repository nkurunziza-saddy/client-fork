import { apiSlice } from "@/services/api/api-entry";
import type {
	AuthResponse,
	SessionUser,
	SignInRequest,
	SignUpRequest,
} from "@/types";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		signIn: builder.mutation<AuthResponse, SignInRequest>({
			queryFn: async (args, _api, _extraOptions, baseQuery) => {
				const result = await baseQuery({
					url: "/auth/sign-in/email",
					method: "POST",
					body: {
						email: args.email,
						password: args.password,
					},
				});

				if (result.error) {
					return { error: result.error };
				}

				const res = (result.meta as { response?: Response })?.response;
				type RawPayload = {
					user?: SessionUser;
					token?: string;
					session?: { token?: string };
				};
				const envelope = result.data as Record<string, unknown>;
				const payload = (envelope?.data ?? envelope) as RawPayload;
				const token =
					res?.headers.get("set-auth-token") ??
					payload?.token ??
					payload?.session?.token ??
					"";

				return {
					data: {
						user: (payload?.user ?? payload) as SessionUser,
						token: token ?? "",
					},
				};
			},
			invalidatesTags: ["Session"],
		}),

		signUp: builder.mutation<AuthResponse, SignUpRequest>({
			queryFn: async (args, _api, _extraOptions, baseQuery) => {
				const result = await baseQuery({
					url: "/auth/sign-up/email",
					method: "POST",
					body: args,
				});

				if (result.error) {
					return { error: result.error };
				}

				const res = (result.meta as { response?: Response })?.response;
				type RawPayload = {
					user?: SessionUser;
					token?: string;
					session?: { token?: string };
				};
				const envelope = result.data as Record<string, unknown>;
				const payload = (envelope?.data ?? envelope) as RawPayload;
				const token =
					res?.headers.get("set-auth-token") ??
					payload?.token ??
					payload?.session?.token ??
					"";

				return {
					data: {
						user: (payload?.user ?? payload) as SessionUser,
						token: token ?? "",
					},
				};
			},
		}),

		getSession: builder.query<{ user?: Record<string, unknown> }, void>({
			query: () => "/auth/get-session",
			providesTags: ["Session"],
		}),

		verifyEmail: builder.mutation<
			{ status?: string },
			{ token: string; callbackURL?: string }
		>({
			query: ({ token, callbackURL }) => ({
				url: `/auth/verify-email?token=${token}${callbackURL ? `&callbackURL=${encodeURIComponent(callbackURL)}` : ""}`,
				method: "GET",
			}),
		}),

		signOut: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/sign-out",
				method: "POST",
			}),
			invalidatesTags: ["Session"],
		}),

		resendVerificationEmail: builder.mutation<void, { email: string }>({
			query: ({ email }) => ({
				url: "/auth/send-verification-email",
				method: "POST",
				body: { email },
			}),
		}),

		forgetPassword: builder.mutation<
			void,
			{ email: string; redirectTo: string }
		>({
			query: (body) => ({
				url: "/auth/forget-password",
				method: "POST",
				body,
			}),
		}),

		resetPassword: builder.mutation<
			void,
			{ token: string; newPassword: string }
		>({
			query: (body) => ({
				url: "/auth/reset-password",
				method: "POST",
				body,
			}),
		}),

		checkEmailUniqueness: builder.query<{ available: boolean }, string>({
			query: (email) => `/auth/check-email?email=${encodeURIComponent(email)}`,
		}),

		checkRegistrationUniqueness: builder.query<{ available: boolean }, string>({
			query: (regId) =>
				`/auth/check-registration?id=${encodeURIComponent(regId)}`,
		}),
	}),
});

export const {
	useSignInMutation,
	useSignUpMutation,
	useGetSessionQuery,
	useSignOutMutation,
	useVerifyEmailMutation,
	useResendVerificationEmailMutation,
	useForgetPasswordMutation,
	useResetPasswordMutation,
	useCheckEmailUniquenessQuery,
	useLazyCheckEmailUniquenessQuery,
	useLazyCheckRegistrationUniquenessQuery,
} = authApi;
