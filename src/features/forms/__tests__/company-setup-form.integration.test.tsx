import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { CompanySetupForm } from "../components/company-setup-form";
import { installFetchMock, jsonResponse } from "@/services/api/__tests__/test-utils";

describe("CompanySetupForm Integration", () => {
	it("validates slug uniqueness and allows submitting company setup", async () => {
		const onSubmit = vi.fn();
		const onSkip = vi.fn();
		const categories = [
			{ id: "cat-1", name: "Construction" },
			{ id: "cat-2", name: "Manufacturing" },
		];

		installFetchMock(async (req) => {
			if (req.url.includes("/companies/check-slug")) {
				const url = new URL(req.url);
				const slug = url.searchParams.get("slug");
				if (slug === "taken-slug") {
					return jsonResponse({ available: false });
				}
				return jsonResponse({ available: true });
			}
			return jsonResponse({}, { status: 404 });
		});

		renderWithProviders(
			<CompanySetupForm 
				onSubmit={onSubmit} 
				onSkip={onSkip} 
				categories={categories} 
			/>
		);

		// 1. Fill basic info
		const nameInput = screen.getByPlaceholderText(/e.g. AfriBuild Ltd/i);
		fireEvent.change(nameInput, { target: { value: "My New Company" } });

		// Slug should be auto-generated
		const slugInput = screen.getByPlaceholderText(/my-store-name/i);
		expect((slugInput as HTMLInputElement).value).toBe("my-new-company");

		// 2. Test slug validation (taken)
		fireEvent.change(slugInput, { target: { value: "taken-slug" } });
		fireEvent.blur(slugInput);

		await waitFor(() => {
			expect(screen.getByText(/already taken/i)).toBeTruthy();
		});

		// 3. Fix slug
		fireEvent.change(slugInput, { target: { value: "fresh-slug" } });
		
		// 4. Fill rest of form
		const typeSelect = screen.getByLabelText(/Company Type/i);
		fireEvent.change(typeSelect, { target: { value: "SUPPLIER_RETAILER" } });

		const categorySelect = screen.getByLabelText(/Main Category/i);
		fireEvent.change(categorySelect, { target: { value: "cat-1" } });

		fireEvent.change(screen.getByPlaceholderText(/Province/i), { target: { value: "Kigali" } });
		fireEvent.change(screen.getByPlaceholderText(/District/i), { target: { value: "Gasabo" } });
		fireEvent.change(screen.getByPlaceholderText(/Sector/i), { target: { value: "Kacyiru" } });
		fireEvent.change(screen.getByPlaceholderText(/Cell/i), { target: { value: "Kamutwa" } });
		fireEvent.change(screen.getByPlaceholderText(/Village/i), { target: { value: "Ubumwe" } });

		const submitButton = screen.getByRole("button", { name: /Complete Setup/i });
		
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
				name: "My New Company",
				slug: "fresh-slug",
				companyType: "SUPPLIER_RETAILER",
				categoryId: "cat-1",
				province: "Kigali",
				district: "Gasabo",
			}));
		});
	});

	it("calls onSkip when skip button is clicked", () => {
		const onSubmit = vi.fn();
		const onSkip = vi.fn();

		renderWithProviders(
			<CompanySetupForm onSubmit={onSubmit} onSkip={onSkip} />
		);

		const skipButton = screen.getByRole("button", { name: /Skip for now/i });
		fireEvent.click(skipButton);

		expect(onSkip).toHaveBeenCalled();
	});
});
