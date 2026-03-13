import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	installFetchMock,
	jsonResponse,
} from "@/services/api/__tests__/test-utils";
import { renderWithProviders } from "@/test/test-utils";
import { SignInPage } from "../components/sign-in-page";

// Mock TanStack Router
vi.mock("@tanstack/react-router", async () => {
	const actual = await vi.importActual("@tanstack/react-router");
	return {
		...actual,
		useNavigate: () => vi.fn(),
		useSearch: vi.fn().mockReturnValue({ from: "/" }),
		useParams: () => ({}),
		Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
			<a href={to}>{children}</a>
		),
	};
});

// Mock the specific Route object used in the page to avoid importing real route objects which trigger routeTree
vi.mock("@/routes/auth.signin", () => ({
	Route: {
		useSearch: () => ({ from: "/" }),
	},
}));

describe("SignIn Integration", () => {
	it("allows a user to sign in successfully", async () => {
		const { fetchMock } = installFetchMock(async (req) => {
			if (req.url.endsWith("/auth/sign-in/email")) {
				return jsonResponse({
					data: {
						user: {
							id: "user-1",
							email: "test@example.com",
							name: "Test User",
							role: "user",
							needsOnboarding: false,
						},
						token: "fake-jwt-token",
					},
				});
			}
			return jsonResponse({}, { status: 404 });
		});

		const { store } = renderWithProviders(<SignInPage />);

		// Fill out the form
		const emailInput = screen.getByPlaceholderText(/name@company.com/i);
		const passwordInput = screen.getByPlaceholderText(/••••••••/i);
		const submitButton = screen.getByRole("button", { name: /Sign In/i });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });

		// Submit the form
		fireEvent.click(submitButton);

		// Wait for the API call and state updates
		await waitFor(() => {
			const state = store.getState();
			expect(state.auth.isAuthenticated).toBe(true);
			expect(state.auth.token).toBe("fake-jwt-token");
			expect(state.auth.user?.email).toBe("test@example.com");
		});

		expect(fetchMock).toHaveBeenCalled();
	});

	it("shows an error message when sign in fails", async () => {
		installFetchMock(async () => {
			return jsonResponse({ message: "Invalid credentials" }, { status: 401 });
		});

		renderWithProviders(<SignInPage />);

		const emailInput = screen.getByPlaceholderText(/name@company.com/i);
		const passwordInput = screen.getByPlaceholderText(/••••••••/i);
		const submitButton = screen.getByRole("button", { name: /Sign In/i });

		fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "wrongpass" } });

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/Invalid credentials/i)).toBeTruthy();
		});
	});
});
