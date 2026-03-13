import { describe, expect, it } from "vitest";
import {
	forgotPasswordSchema,
	profileSchema,
	resetPasswordSchema,
	signInSchema,
	signUpSchema,
} from "../auth";

describe("Auth Schemas Comprehensive Tests", () => {
	describe("signInSchema", () => {
		it("validates correct sign in data", () => {
			const data = { email: "test@example.com", password: "password123" };
			const result = signInSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on invalid email format", () => {
			const invalidEmails = ["test", "test@", "@example.com", "test.com"];
			for (const email of invalidEmails) {
				const result = signInSchema.safeParse({
					email,
					password: "password123",
				});
				expect(result.success).toBe(false);
			}
		});

		it("fails on empty password", () => {
			const result = signInSchema.safeParse({
				email: "test@example.com",
				password: "",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("signUpSchema", () => {
		const validBase = {
			name: "John Doe",
			email: "john@example.com",
			password: "password123",
			confirmPassword: "password123",
		};

		it("validates correct sign up data", () => {
			const result = signUpSchema.safeParse(validBase);
			expect(result.success).toBe(true);
		});

		it("fails when passwords do not match", () => {
			const data = { ...validBase, confirmPassword: "mismatch" };
			const result = signUpSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Passwords do not match");
				expect(result.error.issues[0].path).toContain("confirmPassword");
			}
		});

		it("fails when name is too short", () => {
			const result = signUpSchema.safeParse({ ...validBase, name: "A" });
			expect(result.success).toBe(false);
		});

		it("fails when password is less than 8 characters", () => {
			const result = signUpSchema.safeParse({
				...validBase,
				password: "1234567",
				confirmPassword: "1234567",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("forgotPasswordSchema", () => {
		it("validates correct email", () => {
			const result = forgotPasswordSchema.safeParse({
				email: "test@example.com",
			});
			expect(result.success).toBe(true);
		});

		it("fails on invalid email", () => {
			const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });
			expect(result.success).toBe(false);
		});
	});

	describe("resetPasswordSchema", () => {
		it("validates matching passwords (min 8 chars)", () => {
			const data = {
				newPassword: "newpassword123",
				confirmPassword: "newpassword123",
			};
			const result = resetPasswordSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on non-matching passwords", () => {
			const data = {
				newPassword: "newpassword123",
				confirmPassword: "differentpassword",
			};
			const result = resetPasswordSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it("fails on too short password", () => {
			const data = {
				newPassword: "short",
				confirmPassword: "short",
			};
			const result = resetPasswordSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});

	describe("profileSchema", () => {
		it("validates minimum profile data", () => {
			const data = { name: "Jane Doe" };
			const result = profileSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("validates full profile data", () => {
			const data = {
				name: "Jane Doe",
				phoneNumber: "+250788888888",
				image: "https://example.com/photo.jpg",
			};
			const result = profileSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("fails on short name", () => {
			const result = profileSchema.safeParse({ name: "J" });
			expect(result.success).toBe(false);
		});

		it("accepts empty optional fields", () => {
			const result = profileSchema.safeParse({
				name: "Jane Doe",
				phoneNumber: "",
				image: "",
			});
			expect(result.success).toBe(true);
		});
	});
});
