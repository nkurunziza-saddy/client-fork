import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { AuctionForm } from "../components/auction-form";
import { installFetchMock, jsonResponse } from "@/services/api/__tests__/test-utils";

describe("AuctionForm Integration", () => {
	it("allows submitting a new auction", async () => {
		const onSubmit = vi.fn();
		const onCancel = vi.fn();

		installFetchMock(async () => jsonResponse({ data: [] }));

		renderWithProviders(
			<AuctionForm onSubmit={onSubmit} onCancel={onCancel} />
		);

		// Fill out the form
		const titleInput = screen.getByLabelText(/Auction Title/i);
		fireEvent.change(titleInput, { target: { value: "Rare Tractor" } });

		const priceInput = screen.getByLabelText(/Starting Price/i);
		fireEvent.change(priceInput, { target: { value: "1000000" } });

		const startDateInput = screen.getByLabelText(/Start Date/i);
		fireEvent.change(startDateInput, { target: { value: "2026-03-12T10:00" } });

		const endDateInput = screen.getByLabelText(/End Date/i);
		fireEvent.change(endDateInput, { target: { value: "2026-03-15T10:00" } });

		const descriptionInput = screen.getByPlaceholderText(/Detail the item/i);
		fireEvent.change(descriptionInput, { target: { value: "A very rare tractor." } });

		const submitButton = screen.getByRole("button", { name: /Create Auction/i });
		
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
				title: "Rare Tractor",
				startingPrice: 1000000,
				description: "A very rare tractor.",
			}));
		});
	});
});
