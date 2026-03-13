import { RiStarFill, RiStarLine } from "@remixicon/react";
import React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getFormFieldErrors } from "@/lib/utils";
import { reviewSchema, type ReviewFormValues } from "@/shared/schemas/business";
import { useCreateReviewMutation } from "@/services/api/reviews";
import { FormField } from "@/shared/components/form-field";
import { ResponsiveModal } from "@/shared/components/responsive-modal";

interface AddReviewDialogProps {
  productId?: string;
  serviceId?: string;
  companyId?: string;
  trigger?: React.ReactElement;
}

export const AddReviewDialog: React.FC<AddReviewDialogProps> = ({
  productId,
  serviceId,
  companyId,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
    } as ReviewFormValues,
    validators: {
      onChange: reviewSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createReview({
          rating: value.rating,
          comment: value.comment,
          productId,
          serviceId,
          companyId,
        }).unwrap();
        toast.success("Review submitted successfully.");
        setOpen(false);
        form.reset();
      } catch (err) {
        console.error("Failed to submit review:", err);
        toast.error("Failed to submit review.");
      }
    },
  });

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
      title="Submit Review"
      description="Rate your experience"
      trigger={
        trigger || (
          <Button
            variant="outline"
            className="rounded-none border-primary text-primary font-bold uppercase tracking-widest text-[10px]"
          >
            Write a Review
          </Button>
        )
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field
          name="rating"
          children={(field) => (
            <div className="space-y-4">
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                Rating
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.handleChange(star)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    {star <= field.state.value ? (
                      <RiStarFill className="w-8 h-8 text-primary" />
                    ) : (
                      <RiStarLine className="w-8 h-8 text-muted-foreground/20" />
                    )}
                  </button>
                ))}
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1">
                  {getFormFieldErrors(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="comment"
          children={(field) => (
            <FormField
            	label="Your Review"
            	error={getFormFieldErrors(field.state.meta.errors)}
            	isTouched={field.state.meta.isTouched}
            >

              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Describe quality, lead times, and reliability..."
                className="rounded-none border-border focus:border-primary/50 min-h-[120px] text-sm leading-relaxed"
              />
            </FormField>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isLoading || isSubmitting}
              className="w-full h-12 rounded-none bg-primary text-primary-foreground font-heading font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
            >
              {isLoading || isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          )}
        />
      </form>
    </ResponsiveModal>
  );
};
