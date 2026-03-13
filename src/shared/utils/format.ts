/**
 * Centralized formatting utilities
 */

export const formatCurrency = (value: number | string, currency = "RWF") => {
	const num = typeof value === "string" ? parseFloat(value) : value;
	if (Number.isNaN(num)) return "—";
	return `${currency} ${num.toLocaleString()}`;
};

/**
 * Standard date formatter
 * Default: Nov 15, 2023
 */
export const formatDate = (
	value?: string | Date,
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
) => {
	if (!value) return "—";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-US", options);
};

/**
 * Date and Time formatter
 * Default: Nov 15, 2023, 2:30 PM
 */
export const formatDateTime = (
	value?: string | Date,
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	},
) => {
	if (!value) return "—";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-US", options);
};

export const formatRelativeTime = (value?: string | Date) => {
	if (!value) return "—";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "—";

	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	return formatDate(date);
};
