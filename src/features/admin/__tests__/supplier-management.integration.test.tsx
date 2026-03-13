import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { AdminSuppliersPage } from "../components/suppliers-page";
import { installFetchMock, jsonResponse } from "@/services/api/__tests__/test-utils";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
	Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock useAdminTable hook
vi.mock("@/hooks/use-admin-table", () => ({
	useAdminTable: () => ({
		pagination: { pageIndex: 0, pageSize: 10 },
		setPagination: vi.fn(),
		page: 1,
		limit: 10
	})
}));

// Mock ActionModal to avoid complex UI issues in integration tests
vi.mock("@/shared/components/action-modal", () => ({
	ActionModal: ({ isOpen, onConfirm, title }: any) => {
		if (!isOpen) return null;
		return (
			<div data-testid="mock-action-modal">
				<h2>{title}</h2>
				<button data-testid="confirm-button" onClick={onConfirm}>Confirm</button>
			</div>
		);
	}
}));

describe("AdminSupplierManagement Integration", () => {
	it("allows suspending an active supplier from the list", async () => {
		const { requests } = installFetchMock(async (req) => {
			if (req.url.includes("/companies") && req.method === "GET") {
				return jsonResponse({
					data: [
						{
							id: "sup-1",
							name: "Active Supplier Ltd",
							type: "SUPPLIER_DEALER",
							isActive: true,
							isVerified: true,
							averageRating: 4.5,
							createdAt: new Date().toISOString(),
						}
					],
					meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
				});
			}
			if (req.url.includes("/companies/sup-1") && req.method === "PATCH") {
				return jsonResponse({
					success: true,
					data: { id: "sup-1", isActive: false }
				});
			}
			return jsonResponse({ data: {} });
		});

		renderWithProviders(<AdminSuppliersPage />);

		// 1. Wait for list to load
		await screen.findByText("Active Supplier Ltd");

		// 2. Open Suspend Modal
		const menuButtons = await screen.findAllByRole("button", { name: /Open menu/i });
		fireEvent.click(menuButtons[0]);
		
		const suspendItem = await screen.findByText(/Suspend/i);
		fireEvent.click(suspendItem);

		// 3. Confirm in Mock Modal
		const confirmButton = await screen.findByTestId("confirm-button");
		fireEvent.click(confirmButton);

		// 4. Verify API call via requests array
		await waitFor(() => {
			const patchReq = requests.find(r => 
				r.url.includes("/companies/sup-1") && r.method === "PATCH"
			);
			expect(patchReq).toBeTruthy();
			expect((patchReq?.jsonBody as any).isActive).toBe(false);
		});
	});
});
