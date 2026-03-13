import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFormFieldErrors(errors: any[]): string[] | undefined {
	if (!errors || errors.length === 0) return undefined;

	return errors
		.map((error) => {
			if (typeof error === "string") return error;
			if (typeof error === "object" && "message" in error) return String(error.message);
			return String(error);
		})
		.filter(Boolean);
}

export function handleRtkQueryError(
	error: FetchBaseQueryError | SerializedError | undefined | unknown,
	fallbackMessage = "An unexpected error occurred",
) {
	if (!error) return;

	console.error("RTK Query Error:", error);
	const message = getErrorFromRtkQuery(error, fallbackMessage);
	toast.error(message);
}

export function getErrorFromRtkQuery(
	error: FetchBaseQueryError | SerializedError | undefined | unknown,
	fallbackMessage = "An unexpected error occurred",
): string {
	if (!error) return "";

	if (typeof error === "object" && error !== null && "data" in error) {
		const errorData = error.data as Record<string, any>;
		// Handle the nested error structure from the user's example
		const message =
			errorData?.error?.message ||
			errorData?.message ||
			errorData?.error ||
			fallbackMessage;
		return Array.isArray(message) ? message[0] : message;
	}

	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message || fallbackMessage;
	}

	return fallbackMessage;
}

export async function shareContent(data: {
	title: string;
	text?: string;
	url: string;
}) {
	if (navigator.share) {
		try {
			await navigator.share(data);
			return true;
		} catch (err) {
			if ((err as Error).name !== "AbortError") {
				console.error("Error sharing:", err);
			}
			return false;
		}
	} else {
		try {
			await navigator.clipboard.writeText(data.url);
			toast.info("Link copied to clipboard");
			return true;
		} catch (err) {
			console.error("Error copying to clipboard:", err);
			return false;
		}
	}
}
