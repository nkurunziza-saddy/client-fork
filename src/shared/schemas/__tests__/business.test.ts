import { describe, expect, it } from "vitest";
import {
	auctionSchema,
	companySetupSchema,
	contactSchema,
	productSchema,
	reviewSchema,
	serviceSchema,
	supplierProvisionSchema,
} from "../business";

describe("Business Schemas Comprehensive Tests", () => {
	describe("productSchema", () => {
		const validBase = {
			name: "Cement 50kg",
			categoryId: "cat1",
			price: "12000",
			priceType: "FIXED",
			stock: "100",
			unit: "bag",
		};

		it("validates correct product data", () => {
			const result = productSchema.safeParse(validBase);
			expect(result.success).toBe(true);
		});

		it("accepts exactly 0 for price and stock", () => {
			const data = { ...validBase, price: "0", stock: "0" };
			const result = productSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts valid decimal prices", () => {
			const data = { ...validBase, price: "1200.50" };
			const result = productSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on negative price", () => {
			const data = { ...validBase, price: "-100" };
			const result = productSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it("fails on non-numeric strings for price", () => {
			const result = productSchema.safeParse({ ...validBase, price: "abc" });
			expect(result.success).toBe(false);
		});

		it("fails on missing categoryId", () => {
			const result = productSchema.safeParse({ ...validBase, categoryId: "" });
			expect(result.success).toBe(false);
		});
	});

	describe("serviceSchema", () => {
		const validBase = {
			name: "Expert Consultation",
			categoryId: "cat2",
			description: "Professional advice for your project (minimum 10 chars)",
			price: "1000",
			priceType: "FIXED",
			duration: "1h",
			discount: "0",
		};

		it("validates correct service data", () => {
			const result = serviceSchema.safeParse(validBase);
			expect(result.success).toBe(true);
		});

		it("accepts 100% discount", () => {
			const result = serviceSchema.safeParse({ ...validBase, discount: "100" });
			expect(result.success).toBe(true);
		});

		it("fails on 100.1% discount", () => {
			const result = serviceSchema.safeParse({ ...validBase, discount: "100.1" });
			expect(result.success).toBe(false);
		});

		it("fails on too short description", () => {
			const result = serviceSchema.safeParse({ ...validBase, description: "Short" });
			expect(result.success).toBe(false);
		});
	});

	describe("auctionSchema", () => {
		const validBase = {
			title: "Heavy Machinery",
			description: "Heavy duty machinery available for bidding",
			startingPrice: "1000000",
			startDate: "2026-01-01T10:00",
			endDate: "2026-01-02T10:00",
		};

		it("validates correct auction data", () => {
			const result = auctionSchema.safeParse(validBase);
			expect(result.success).toBe(true);
		});

		it("fails when end date is before start date", () => {
			const data = {
				...validBase,
				startDate: "2026-01-02T10:00",
				endDate: "2026-01-01T10:00",
			};
			const result = auctionSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("End date must be after start date");
			}
		});

		it("fails when start and end date are identical", () => {
			const now = "2026-03-12T19:00";
			const result = auctionSchema.safeParse({
				...validBase,
				startDate: now,
				endDate: now,
			});
			expect(result.success).toBe(false);
		});
	});

	describe("companySetupSchema", () => {
		it("validates correct company data", () => {
			const data = {
				name: "AfriBuild",
				slug: "afribuild",
				categoryId: "cat1",
				companyType: "SUPPLIER_RETAILER",
				province: "Kigali",
				district: "Nyarugenge",
				sector: "Nyarugenge",
				cell: "Kiyovu",
				village: "Ubumwe",
			};
			const result = companySetupSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on invalid slug format", () => {
			const data = {
				name: "AfriBuild",
				slug: "Afri Build!",
				categoryId: "cat1",
				companyType: "SUPPLIER_RETAILER",
				province: "Kigali",
				district: "Nyarugenge",
				sector: "Nyarugenge",
				cell: "Kiyovu",
				village: "Ubumwe",
			};
			const result = companySetupSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it("fails on missing required address fields", () => {
			const data = {
				name: "AfriBuild",
				categoryId: "cat1",
				companyType: "SUPPLIER_RETAILER",
				province: "Kigali",
				district: "Nyarugenge",
				sector: "",
				cell: "",
				village: "",
			};
			const result = companySetupSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});

	describe("supplierProvisionSchema", () => {
		const validBase = {
			companyName: "Tech Solutions",
			industry: "IT",
			registrationId: "TIN123456",
			location: "Kigali",
			district: "Gasabo",
			fullName: "John Agent",
			email: "john@tech.rw",
			phoneNumber: "0788123456",
			position: "Director",
		};

		it("validates correct provision data", () => {
			const result = supplierProvisionSchema.safeParse(validBase);
			expect(result.success).toBe(true);
		});

		it("fails on short phone number", () => {
			const result = supplierProvisionSchema.safeParse({
				...validBase,
				phoneNumber: "12345",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("reviewSchema", () => {
		it("validates correct review data", () => {
			const data = {
				rating: 4,
				comment: "Excellent service and quality materials.",
			};
			const result = reviewSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on rating > 5", () => {
			const result = reviewSchema.safeParse({ rating: 6, comment: "Too high" });
			expect(result.success).toBe(false);
		});

		it("fails on rating < 1", () => {
			const result = reviewSchema.safeParse({ rating: 0, comment: "Too low" });
			expect(result.success).toBe(false);
		});
	});

	describe("contactSchema", () => {
		it("validates correct message length", () => {
			const result = contactSchema.safeParse({ message: "This is a long enough message." });
			expect(result.success).toBe(true);
		});

		it("fails on short message", () => {
			const result = contactSchema.safeParse({ message: "Too short" });
			expect(result.success).toBe(false);
		});
	});
});
