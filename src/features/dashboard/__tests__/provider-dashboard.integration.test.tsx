import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import ProviderDashboard from "../components/provider-dashboard";
import { installFetchMock, jsonResponse } from "@/services/api/__tests__/test-utils";
import React from "react";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
	Link: ({ children, to }: any) => <a href={to}>{children}</a>,
	Await: ({ children, promise }: any) => {
		const [data, setData] = React.useState(null);
		React.useEffect(() => {
			promise.then(setData);
		}, [promise]);
		return data ? children(data) : <div>Loading...</div>;
	}
}));

// Mock ConfirmationModal
vi.mock("@/shared/components/confirmation-modal", () => ({
	ConfirmationModal: ({ isOpen, onConfirm, title }: any) => {
		if (!isOpen) return null;
		return (
			<div data-testid="mock-confirmation-modal">
				<h2>{title}</h2>
				<button data-testid="confirm-button" onClick={onConfirm}>Confirm</button>
			</div>
		);
	}
}));

const mockDeferredData = Promise.resolve({
	categories: { data: [] },
	products: {
		data: [
			{ 
				id: "prod-123", 
				name: "Dashboard Tractor", 
				isActive: true, 
				createdAt: new Date().toISOString(),
				priceType: "FIXED",
				views: 0,
				category: { id: "cat-1", name: "Machinery" },
				company: { id: "comp-1", name: "Test Provider Co" }
			} as any
		],
		meta: { total: 1 }
	},
	services: { data: [], meta: { total: 0 } }
});

describe("ProviderDashboard Integration", () => {
	it("allows a provider to delete a product listing", async () => {
		const { requests } = installFetchMock(async (req) => {
			if (req.method === "DELETE" && req.url.includes("/products/prod-123")) {
				return jsonResponse({ success: true });
			}
			return jsonResponse({ data: {} });
		});

		const initialCompany = {
			id: "comp-1",
			name: "Test Provider Co",
			type: "SUPPLIER_DEALER",
			isActive: true,
			isVerified: true,
			createdAt: new Date().toISOString(),
		};

		renderWithProviders(
			<ProviderDashboard 
				initialCompany={initialCompany as any} 
				deferred={mockDeferredData} 
			/>
		);

		// 1. Wait for deferred data to resolve and show listing
		await screen.findAllByText("Dashboard Tractor");

		// 2. Click Delete button using data-testid
		const deleteButtons = await screen.findAllByTestId("delete-listing-button");
		fireEvent.click(deleteButtons[0]);

		// 3. Confirm in Mock Modal
		const confirmButton = await screen.findByTestId("confirm-button");
		fireEvent.click(confirmButton);

		// 4. Verify API call via requests array
		await waitFor(() => {
			const deleteReq = requests.find(r => 
				r.url.includes("/products/prod-123") && r.method === "DELETE"
			);
			expect(deleteReq).toBeTruthy();
		});
	});
});
