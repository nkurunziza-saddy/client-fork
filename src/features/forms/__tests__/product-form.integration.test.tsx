import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { ProductForm } from "../components/product-form";
import { installFetchMock, jsonResponse } from "@/services/api/__tests__/test-utils";

describe("ProductForm Integration", () => {
	it("renders categories and allows submitting a new product", async () => {
		const onSubmit = vi.fn();
		const onCancel = vi.fn();

		const { fetchMock } = installFetchMock(async (req) => {
			if (req.url.endsWith("/product-categories?limit=100")) {
				return jsonResponse({
					data: [
						{ id: "cat-1", name: "Machinery" },
						{ id: "cat-2", name: "Tools" },
					],
				});
			}
			return jsonResponse({}, { status: 404 });
		});

		renderWithProviders(
			<ProductForm onSubmit={onSubmit} onCancel={onCancel} />
		);

		// Wait for categories to load
		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalled();
		});

		// Fill out the form
		const nameInput = screen.getByPlaceholderText(/Enter product name/i);
		fireEvent.change(nameInput, { target: { value: "New Tractor" } });

		// Select category (Radix Select needs special handling in tests usually, 
		// but let's see if we can find the trigger)
		const categoryTrigger = screen.getByRole("combobox", { name: /Select Category/i });
		fireEvent.click(categoryTrigger);
		
		// In Radix Select, the options are usually rendered in a portal
		// We might need to wait for them
		const categoryOption = await screen.findByText("Machinery");
		fireEvent.click(categoryOption);

		const priceInput = screen.getByPlaceholderText("0.00");
		fireEvent.change(priceInput, { target: { value: "500000" } });

		const stockInput = screen.getByPlaceholderText("0");
		fireEvent.change(stockInput, { target: { value: "10" } });

		const unitInput = screen.getByPlaceholderText(/piece, kg, box/i);
		fireEvent.change(unitInput, { target: { value: "unit" } });

		const submitButton = screen.getByRole("button", { name: /Create Product/i });
		
		// Form should be valid now
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
				name: "New Tractor",
				categoryId: "cat-1",
				price: "500000",
				stock: "10",
				unit: "unit",
			}));
		});
	});

	it("calls onCancel when cancel button is clicked", () => {
		const onSubmit = vi.fn();
		const onCancel = vi.fn();

		installFetchMock(async () => jsonResponse({ data: [] }));

		renderWithProviders(
			<ProductForm onSubmit={onSubmit} onCancel={onCancel} />
		);

		const cancelButton = screen.getByRole("button", { name: /Cancel/i });
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});
});
