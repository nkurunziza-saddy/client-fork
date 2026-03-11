import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useAuctionsParams() {
	return useQueryStates(
		{
			q: parseAsString.withDefault(""),
			minPrice: parseAsString.withDefault(""),
			maxPrice: parseAsString.withDefault(""),
			sortBy: parseAsString.withDefault("createdAt"),
			sortOrder: parseAsString.withDefault("DESC"),
			page: parseAsInteger.withDefault(1),
		},
		{
			history: "push",
			shallow: false, // Wait for loaders
		},
	);
}
