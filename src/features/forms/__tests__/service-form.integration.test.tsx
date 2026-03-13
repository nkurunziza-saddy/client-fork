import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	installFetchMock,
	jsonResponse,
} from "@/services/api/__tests__/test-utils";
import { renderWithProviders } from "@/test/test-utils";
import { ServiceForm } from "../components/service-form";

describe("ServiceForm Integration", () => {
	it("renders categories and allows submitting a new service", async () => {
		const onSubmit = vi.fn();
		const onCancel = vi.fn();

		const { fetchMock } = installFetchMock(async (req) => {
			if (req.url.endsWith("/service-categories?limit=100")) {
				return jsonResponse({
					data: [
						{ id: "scat-1", name: "Engineering" },
						{ id: "scat-2", name: "Logistics" },
					],
				});
			}
			return jsonResponse({}, { status: 404 });
		});

		renderWithProviders(
			<ServiceForm onSubmit={onSubmit} onCancel={onCancel} />,
		);

		// Wait for categories
		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalled();
		});

		// Fill out the form
		const nameInput = screen.getByLabelText(/Service Name/i);
		fireEvent.change(nameInput, { target: { value: "Site Survey" } });

		const categoryTrigger = screen.getByRole("combobox", {
			name: /Select Category/i,
		});
		fireEvent.click(categoryTrigger);
		const categoryOption = await screen.findByText("Engineering");
		fireEvent.click(categoryOption);

		const rateInput = screen.getByLabelText(/Rate/i);
		fireEvent.change(rateInput, { target: { value: "50000" } });

		const durationInput = screen.getByLabelText(/Duration/i);
		fireEvent.change(durationInput, { target: { value: "2 days" } });

		const descriptionInput = screen.getByLabelText(/Service Description/i);
		fireEvent.change(descriptionInput, {
			target: { value: "Professional site survey." },
		});

		const submitButton = screen.getByRole("button", {
			name: /Create Service/i,
		});

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "Site Survey",
					categoryId: "scat-1",
					price: "50000",
					duration: "2 days",
					description: "Professional site survey.",
				}),
			);
		});
	});
});
