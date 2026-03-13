import { useEffect, useState } from "react";
import type { Product, Supplier } from "@/types";

interface WishlistItem {
	id: string;
	type: "product" | "supplier";
	item: Product | Supplier;
	addedAt: string;
}

export const useWishlist = () => {
	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

	// Load wishlist from localStorage on mount
	useEffect(() => {
		const savedWishlist = localStorage.getItem("karibu-wishlist");
		if (savedWishlist) {
			try {
				setWishlistItems(JSON.parse(savedWishlist));
			} catch (error) {
				console.error("Error loading wishlist:", error);
			}
		}
	}, []);

	// Save wishlist to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("karibu-wishlist", JSON.stringify(wishlistItems));
	}, [wishlistItems]);

	const addToWishlist = (
		item: Product | Supplier,
		type: "product" | "supplier",
	) => {
		const newItem: WishlistItem = {
			id: item.id,
			type,
			item,
			addedAt: new Date().toISOString(),
		};

		setWishlistItems((prev) => {
			// Check if item already exists
			const exists = prev.some(
				(wishlistItem) =>
					wishlistItem.id === item.id && wishlistItem.type === type,
			);

			if (exists) {
				return prev;
			}

			return [...prev, newItem];
		});
	};

	const removeFromWishlist = (id: string, type: "product" | "supplier") => {
		setWishlistItems((prev) =>
			prev.filter((item) => !(item.id === id && item.type === type)),
		);
	};

	const isInWishlist = (id: string, type: "product" | "supplier") => {
		return wishlistItems.some((item) => item.id === id && item.type === type);
	};

	const getWishlistProducts = () => {
		return wishlistItems
			.filter((item) => item.type === "product")
			.map((item) => item.item as Product);
	};

	const getWishlistSuppliers = () => {
		return wishlistItems
			.filter((item) => item.type === "supplier")
			.map((item) => item.item as Supplier);
	};

	const clearWishlist = () => {
		setWishlistItems([]);
	};

	return {
		wishlistItems,
		addToWishlist,
		removeFromWishlist,
		isInWishlist,
		getWishlistProducts,
		getWishlistSuppliers,
		clearWishlist,
		wishlistCount: wishlistItems.length,
	};
};
