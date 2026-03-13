import type React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { useStartAuctionChatMutation } from "@/services/api/messages";
import { FormField } from "@/shared/components/form-field";
import { ResponsiveModal } from "@/shared/components/responsive-modal";

interface PlaceBidModalProps {
  auctionId: string;
  startingPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  auctionId,
  startingPrice,
  isOpen,
  onClose,
}) => {
  const [startAuctionChat, { isLoading }] = useStartAuctionChatMutation();

  const bidSchema = z.object({
    bidAmount: z.string().refine(
      (val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= startingPrice;
      },
      {
        message: `Bid must be at least ${startingPrice.toLocaleString()} RWF`,
      },
    ),
    message: z.string().optional(),
  });

  type BidFormValues = z.infer<typeof bidSchema>;

  const form = useForm({
    defaultValues: {
      bidAmount: "",
      message: "",
    } as BidFormValues,
    validators: {
      onChange: bidSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const amountNum = Number(value.bidAmount);
        const content = `[BID NOTIFICATION]\nI am placing a bid of ${amountNum.toLocaleString()} RWF on this auction.\n\nMessage: ${value.message || "I am very interested in this item!"}`;

        await startAuctionChat({ auctionId, content }).unwrap();
        toast.success("Bid placed successfully! The vendor has been notified.");
        onClose();
        form.reset();
      } catch (error: any) {
        toast.error(
          error.data?.error?.message || "Please sign in to place a bid.",
        );
      }
    },
  });

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          form.reset();
        }
      }}
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col">
        <div className="p-6 bg-white border-b border-border/10 space-y-2">
          <h2 className="font-display font-black uppercase text-2xl tracking-tighter">
            Place Your Bid
          </h2>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-80">
            Submit your offer to the vendor
          </p>
        </div>

        <div className="p-6 space-y-6">
          <form.Field
            name="bidAmount"
            children={(field) => (
              <FormField
                label="Bid Amount (RWF)"
                required
                error={getFormFieldErrors(field.state.meta.errors)}
                isTouched={field.state.meta.isTouched}
              >
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={`Min: ${startingPrice.toLocaleString()}`}
                  className="h-12 rounded-none bg-background focus:ring-0 text-sm font-bold"
                />
              </FormField>
            )}
          />

          <form.Field
            name="message"
            children={(field) => (
              <FormField
                label="Optional Message"
                error={getFormFieldErrors(field.state.meta.errors)}
                isTouched={field.state.meta.isTouched}
              >
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Add a message to the vendor..."
                  className="w-full h-32 p-4 border border-border/40 rounded-none text-sm focus:ring-1 focus:ring-primary outline-none resize-none bg-background"
                />
              </FormField>
            )}
          />
        </div>

        <div className="p-6 bg-muted/20 border-t border-border/10 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-none h-12 text-[10px] font-black uppercase tracking-widest"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className="flex-1 rounded-none h-12 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => form.handleSubmit()}
                disabled={!canSubmit || isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Submitting..." : "Submit Bid"}
              </Button>
            )}
          />
        </div>
      </div>
    </ResponsiveModal>
  );
};
