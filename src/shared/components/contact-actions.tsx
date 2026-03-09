import { RiMailSendLine, RiPhoneLine, RiWhatsappLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useLogInteractionMutation } from "@/services/api/interactions";
import type { LogInteractionPayload } from "@/types";

interface ContactActionsProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  companyName?: string;
  companyId?: string;
  productId?: string;
  serviceId?: string;
  auctionId?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function ContactActions({
  phone,
  email,
  whatsapp,
  companyName,
  companyId,
  productId,
  serviceId,
  auctionId,
  className,
  size = "default",
}: ContactActionsProps) {
  const [logInteraction] = useLogInteractionMutation();

  const handleLog = (type: LogInteractionPayload["type"]) => {
    logInteraction({
      type,
      companyId,
      productId,
      serviceId,
      metadata: { auctionId },
    }).catch(console.error);
  };

  const handleCall = () => {
    if (!phone) return;
    handleLog("CALL_CLICK");
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    if (!whatsapp && !phone) return;
    handleLog("WHATSAPP_CLICK");
    const targetPhone = whatsapp || phone;
    // Clean phone number: remove non-numeric chars
    const clnPhone = targetPhone?.replace(/\D/g, "");
    const text = companyName
      ? `Hello ${companyName}, I found your profile on AfriMarket and I'm interested in your services.`
      : "Hello, I found your profile on AfriMarket and I'm interested in your services.";
    window.open(
      `https://wa.me/${clnPhone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleEmail = () => {
    if (!email) return;
    handleLog("EMAIL_CLICK");
    const subject = "Inquiry from AfriMarket";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  const isSmall = size === "sm";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      {(phone || whatsapp) && (
        <>
          <Button
            variant="outline"
            size={size}
            className={`rounded-none border-green-600/30 text-green-700 hover:bg-green-50 hover:text-green-800 ${
              isSmall ? "h-8 px-3 text-[9px]" : "h-11 px-4 text-[10px]"
            } font-black uppercase tracking-widest`}
            onClick={handleWhatsApp}
          >
            <RiWhatsappLine
              className={isSmall ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}
            />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size={size}
            className={`rounded-none border-blue-600/30 text-blue-700 hover:bg-blue-50 hover:text-blue-800 ${
              isSmall ? "h-8 px-3 text-[9px]" : "h-11 px-4 text-[10px]"
            } font-black uppercase tracking-widest`}
            onClick={handleCall}
          >
            <RiPhoneLine
              className={isSmall ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}
            />
            Call
          </Button>
        </>
      )}
      {email && (
        <Button
          variant="outline"
          size={size}
          className={`rounded-none border-amber-600/30 text-amber-700 hover:bg-amber-50 hover:text-amber-800 ${
            isSmall ? "h-8 px-3 text-[9px]" : "h-11 px-4 text-[10px]"
          } font-black uppercase tracking-widest`}
          onClick={handleEmail}
        >
          <RiMailSendLine
            className={isSmall ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}
          />
          Email
        </Button>
      )}
    </div>
  );
}
