import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useSendMessageMutation } from "@/services/api/messages";
import type { RootState } from "@/store";
import type { Company } from "@/types";

export function useSupplierActions(company: Company | null | undefined) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading: sendingInquiry }] = useSendMessageMutation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const handleOpenContactModal = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to contact suppliers.");
      return;
    }
    setShowContactModal(true);
  }, [isAuthenticated]);

  const handleSubmitInquiry = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!isAuthenticated) {
        toast.error("Please sign in to send a message.");
        return;
      }
      if (!message.trim()) {
        toast.error("Please enter your inquiry message.");
        return;
      }
      const receiverId = company?.ownerId;
      if (!receiverId) {
        toast.error("Supplier contact is not available.");
        return;
      }
      try {
        await sendMessage({
          receiverId,
          content: message.trim(),
        }).unwrap();
        toast.success("Inquiry sent.");
        setShowContactModal(false);
        setMessage("");
      } catch (error) {
        console.error(error);
        toast.error("Failed to send inquiry.");
      }
    },
    [message, company, sendMessage, isAuthenticated],
  );

  return {
    showContactModal,
    setShowContactModal,
    handleOpenContactModal,
    message,
    setMessage,
    handleSubmitInquiry,
    sendingInquiry,
  };
}
