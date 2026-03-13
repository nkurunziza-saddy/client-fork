import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { ProductCard } from "../components/catalog/product-card";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		preloadRoute: vi.fn(),
	}),
}));

const mockProduct: any = {
	id: "p-1",
	name: "Test Product",
	price: 1000,
	category: { name: "Electronics" },
	company: { name: "Test Corp" },
	images: ["test.jpg"],
};

describe("ProductCard", () => {
	it("triggers onToggleWishlist when wishlist button is clicked", () => {
		const onToggleWishlist = vi.fn();
		const onClick = vi.fn();

		renderWithProviders(
			<ProductCard
				product={mockProduct}
				onToggleWishlist={onToggleWishlist}
				onClick={onClick}
			/>
		);

		// Find the heart button using data-testid
		const wishlistButton = screen.getByTestId("wishlist-button");
		fireEvent.click(wishlistButton);

		expect(onToggleWishlist).toHaveBeenCalled();
	});

	it("triggers onClick when the card is clicked", () => {
		const onClick = vi.fn();

		renderWithProviders(
			<ProductCard product={mockProduct} onClick={onClick} />
		);

		// The card itself has role="button"
		const card = screen.getByRole("button", { name: /Test Product/i });
		fireEvent.click(card);

		expect(onClick).toHaveBeenCalled();
	});
});
