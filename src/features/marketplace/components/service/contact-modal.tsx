import type React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getFormFieldErrors } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FormField } from "@/shared/components/form-field";
import type { Service } from "@/types";

interface ContactModalProps {
  service: Service;
  formId: string;
  sendingInquiry: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const contactSchema = z.object({
  message: z.string().min(10, "Please enter at least 10 characters"),
});

export const ContactModal: React.FC<ContactModalProps> = ({
  service,
  formId,
  sendingInquiry,
  onClose,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
      message: "",
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value.message);
    },
  });

  return (
    <div className="fixed inset-0 bg-foreground/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="bg-background rounded-none border border-border max-w-md w-full p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <span className="sr-only">Close</span>
          <div className="w-6 h-6 flex items-center justify-center text-xl">
            ×
          </div>
        </button>

        <h2 className="text-2xl font-heading font-bold uppercase text-foreground mb-2 tracking-wide">
          Initial Inquiry
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Connect with {service.company?.name || "the provider"} regarding this
          service.
        </p>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-1.5">
            <label
              htmlFor={`${formId}-subject`}
              className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground"
            >
              Subject Ref
            </label>
            <input
              id={`${formId}-subject`}
              type="text"
              readOnly
              value={`REQ: ${service.name} [ID: ${service.id?.slice(0, 6) || "N/A"}]`}
              className="w-full px-4 py-3 border border-border rounded-none bg-muted/20 outline-none text-xs font-mono text-muted-foreground cursor-not-allowed"
            />
          </div>

          <form.Field
            name="message"
            children={(field) => (
              <FormField
                label="Message Details"
                error={getFormFieldErrors(field.state.meta.errors)}
              >
                <textarea
                  id={field.name}
                  rows={4}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe your project requirements..."
                  className="w-full px-4 py-3 border border-border rounded-none bg-background outline-none resize-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </FormField>
            )}
          />

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full rounded-none h-11 font-heading uppercase tracking-wider text-[10px]"
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || sendingInquiry || isSubmitting}
                  className="w-full rounded-none h-11 font-heading uppercase tracking-wider text-[10px] bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {sendingInquiry || isSubmitting
                    ? "Sending..."
                    : "Submit Inquiry"}
                </Button>
              )}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};
