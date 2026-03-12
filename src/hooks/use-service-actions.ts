import { useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLogInteractionMutation } from "@/services/api/interactions";
import { useStartServiceChatMutation } from "@/services/api/messages";
import {
	useAddToWishlistMutation,
	useGetWishlistQuery,
	useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import type { RootState } from "@/store";
import type { Service } from "@/types";

export function useServiceActions(service: Service) {
	const router = useRouter();
	const [showContactModal, setShowContactModal] = useState(false);
	const [message, setMessage] = useState("");

	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [addToWishlist] = useAddToWishlistMutation();
	const [removeFromWishlist] = useRemoveFromWishlistMutation();
	const [startServiceChat, { isLoading: sendingInquiry }] =
		useStartServiceChatMutation();
	const [logInteraction] = useLogInteractionMutation();

	const isInWishlist =
		Array.isArray(wishlist) &&
		wishlist.some((l: { id: string }) => l.id === service.id);

	const handleToggleWishlist = useCallback(async () => {
		if (!isAuthenticated) {
			toast.error("Please login to add to wishlist");
			return;
		}
		try {
			if (isInWishlist) {
				await removeFromWishlist({ id: service.id, type: "service" }).unwrap();
				toast.success("Removed from wishlist");
			} else {
				await addToWishlist({ id: service.id, type: "service" }).unwrap();
				toast.success("Added to wishlist");
			}
		} catch {
			toast.error("Failed to update wishlist");
		}
	}, [
		isAuthenticated,
		isInWishlist,
		service.id,
		addToWishlist,
		removeFromWishlist,
	]);

	const trackAndNavigate = useCallback(
		(type: "CALL_CLICK" | "EMAIL_CLICK" | "WHATSAPP_CLICK", href: string) => {
			logInteraction({ type, serviceId: service.id });
			window.open(href, "_blank", "noopener,noreferrer");
		},
		[logInteraction, service.id],
	);

	const handleBack = useCallback(() => {
		router.history.back();
	}, [router.history]);

	const handleSubmitInquiry = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!message.trim()) {
				toast.error("Please enter your inquiry message.");
				return;
			}
			try {
				await startServiceChat({
					serviceId: service.id,
					content: message.trim(),
				}).unwrap();
				toast.success("Inquiry sent successfully!");
				setShowContactModal(false);
				setMessage("");
				router.navigate({ to: "/messages" });
			} catch (err) {
				console.error(err);
				toast.error("Failed to send inquiry.");
			}
		},
		[message, service.id, startServiceChat, router],
	);

	return {
		showContactModal,
		setShowContactModal,
		message,
		setMessage,
		isInWishlist,
		handleToggleWishlist,
		trackAndNavigate,
		handleBack,
		handleSubmitInquiry,
		sendingInquiry,
		isAuthenticated,
	};
}
