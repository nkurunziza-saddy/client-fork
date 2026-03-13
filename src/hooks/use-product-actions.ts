import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLogInteractionMutation } from "@/services/api/interactions";
import { useStartProductChatMutation } from "@/services/api/messages";
import {
	useAddToWishlistMutation,
	useGetWishlistQuery,
	useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import type { RootState } from "@/store";

export function useProductActions(productId: string) {
	const navigate = useNavigate();
	const [messageOpen, setMessageOpen] = useState(false);

	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [addToWishlist] = useAddToWishlistMutation();
	const [removeFromWishlist] = useRemoveFromWishlistMutation();
	const [startProductChat] = useStartProductChatMutation();
	const [logInteraction] = useLogInteractionMutation();

	const trackAndNavigate = useCallback(
		(type: "CALL_CLICK" | "EMAIL_CLICK" | "WHATSAPP_CLICK", href: string) => {
			logInteraction({ type, productId });
			window.open(href, "_blank", "noopener,noreferrer");
		},
		[logInteraction, productId],
	);

	const isInWishlist =
		Array.isArray(wishlist) &&
		wishlist.some((saved: { id: string }) => saved.id === productId);

	const handleToggleWishlist = useCallback(async () => {
		if (!isAuthenticated) {
			toast.error("Please login to add to wishlist");
			return;
		}
		try {
			if (isInWishlist) {
				await removeFromWishlist({ id: productId, type: "product" }).unwrap();
				toast.success("Removed from wishlist");
			} else {
				await addToWishlist({ id: productId, type: "product" }).unwrap();
				toast.success("Added to wishlist");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to update wishlist");
		}
	}, [
		isAuthenticated,
		isInWishlist,
		productId,
		addToWishlist,
		removeFromWishlist,
	]);

	const handleSubmitInquiry = useCallback(async (message: string) => {
		if (!message.trim()) return;
		try {
			await startProductChat({
				productId,
				content: message.trim(),
			}).unwrap();
			toast.success("Inquiry sent successfully!");
			setMessageOpen(false);
			navigate({ to: "/messages" });
		} catch (error) {
			console.error(error);
			toast.error("Inquiry delivery failed.");
		}
	}, [productId, startProductChat, navigate]);

	return {
		messageOpen,
		setMessageOpen,
		isInWishlist,
		handleToggleWishlist,
		trackAndNavigate,
		handleSubmitInquiry,
		isAuthenticated,
	};
}
