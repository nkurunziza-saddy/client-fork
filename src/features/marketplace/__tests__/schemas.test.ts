import { describe, expect, it } from "vitest";
import {
	marketplaceSearchSchema,
	auctionSearchSchema,
	suppliersSearchSchema,
} from "../schemas";

describe("Marketplace Search Schemas", () => {
	describe("marketplaceSearchSchema", () => {
		it("validates empty search with defaults", () => {
			const result = marketplaceSearchSchema.safeParse({});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.type).toBe("all");
				expect(result.data.page).toBe(1);
				expect(result.data.sortBy).toBe("createdAt");
			}
		});

		it("accepts valid numeric prices", () => {
			const result = marketplaceSearchSchema.safeParse({
				minPrice: 100,
				maxPrice: 500,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.minPrice).toBe(100);
				expect(result.data.maxPrice).toBe(500);
			}
		});

		it("validates sortOrder correctly", () => {
			const result = marketplaceSearchSchema.safeParse({
				sortOrder: "ASC",
			});
			expect(result.success).toBe(true);
			expect(result.data?.sortOrder).toBe("ASC");
		});
	});

	describe("auctionSearchSchema", () => {
		it("validates with defaults", () => {
			const result = auctionSearchSchema.safeParse({});
			expect(result.success).toBe(true);
			expect(result.data?.page).toBe(1);
			expect(result.data?.q).toBe("");
		});

		it("accepts query string", () => {
			const result = auctionSearchSchema.safeParse({ q: "tractor" });
			expect(result.success).toBe(true);
			expect(result.data?.q).toBe("tractor");
		});
	});

	describe("suppliersSearchSchema", () => {
		it("validates with defaults", () => {
			const result = suppliersSearchSchema.safeParse({});
			expect(result.success).toBe(true);
			expect(result.data?.categoryId).toBe("all");
			expect(result.data?.verified).toBe(false);
		});

		it("handles verified boolean", () => {
			const result = suppliersSearchSchema.safeParse({ verified: true });
			expect(result.success).toBe(true);
			expect(result.data?.verified).toBe(true);
		});

		it("accepts minRating string", () => {
			const result = suppliersSearchSchema.safeParse({ minRating: "4" });
			expect(result.success).toBe(true);
			expect(result.data?.minRating).toBe("4");
		});
	});
});
