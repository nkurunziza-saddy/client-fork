import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  installFetchMock,
  jsonResponse,
} from "@/services/api/__tests__/test-utils";
import { renderWithProviders } from "@/test/test-utils";
import ProviderDashboard from "../components/provider-dashboard";
import type { Company, Product, ProductCategory, Service } from "@/types";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  Await: ({
    children,
    promise,
  }: {
    children: (data: unknown) => React.ReactNode;
    promise: Promise<unknown>;
  }) => {
    const [data, setData] = React.useState<unknown>(null);
    React.useEffect(() => {
      promise.then((res) => setData(res));
    }, [promise]);
    return data ? children(data) : <div>Loading...</div>;
  },
}));

// Mock ConfirmationModal
vi.mock("@/shared/components/confirmation-modal", () => ({
  ConfirmationModal: ({
    isOpen,
    onConfirm,
    title,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-confirmation-modal">
        <h2>{title}</h2>
        <button type="button" data-testid="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    );
  },
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
        company: { id: "comp-1", name: "Test Provider Co" },
      } as unknown as Product,
    ],
    meta: { total: 1, totalPages: 1 },
  },
  services: { data: [] as Service[], meta: { total: 0, totalPages: 0 } },
}) as unknown as Promise<{
  categories: { data: ProductCategory[] };
  products: { data: Product[]; meta: { totalPages: number } };
  services: { data: Service[]; meta: { totalPages: number } };
}>;

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
    } as unknown as Company;

    renderWithProviders(
      <ProviderDashboard
        initialCompany={initialCompany}
        deferred={mockDeferredData}
      />,
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
      const deleteReq = requests.find(
        (r) => r.url.includes("/products/prod-123") && r.method === "DELETE",
      );
      expect(deleteReq).toBeTruthy();
    });
  });
});
