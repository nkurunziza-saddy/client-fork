import type React from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { getFormFieldErrors } from "@/lib/utils";
import { contactSchema, type ContactFormValues } from "@/shared/schemas/business";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components/form-field";
import { ResponsiveModal } from "@/shared/components/responsive-modal";

interface ProductInquiryModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	productName: string;
	onSubmit: (message: string) => void;
}

export const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({
	isOpen,
	onOpenChange,
	productName,
	onSubmit,
}) => {
	const form = useForm({
		defaultValues: {
			message: "",
		} as ContactFormValues,
		validators: {
			onChange: contactSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value.message);
			form.reset();
		},
	});

	return (
		<ResponsiveModal
			open={isOpen}
			onOpenChange={(open) => {
				onOpenChange(open);
				if (!open) form.reset();
			}}
			title="Material Inquiry"
			description={`Initiate a professional inquiry regarding "${productName}".`}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Technical responses are typically generated within 2 hours.
				</p>
				<form.Field
					name="message"
					children={(field) => (
						<FormField
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Describe your requirements or volume needs..."
								className="min-h-32 rounded-none border-border bg-muted/5 p-4 resize-none focus-visible:ring-1 focus-visible:ring-primary text-sm"
							/>
						</FormField>
					)}
				/>
				<div className="flex flex-col sm:flex-row justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="rounded-none text-[10px] uppercase font-black tracking-widest h-11 px-6 order-2 sm:order-1"
					>
						Cancel
					</Button>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="rounded-none text-[10px] uppercase font-black tracking-widest h-11 px-8 bg-primary text-primary-foreground order-1 sm:order-2"
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "Sending..." : "Submit Inquiry"}
							</Button>
						)}
					/>
				</div>
			</form>
		</ResponsiveModal>
	);
};
