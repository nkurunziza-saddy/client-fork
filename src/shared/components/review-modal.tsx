import { RiStarFill, RiStarLine } from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getFormFieldErrors } from "@/lib/utils";
import { type ReviewFormValues, reviewSchema } from "@/shared/schemas/business";
import { FormField } from "./form-field";
import { ResponsiveModal } from "./responsive-modal";

interface ReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	providerName: string;
	itemName: string;
	onSubmit?: (payload: {
		rating: number;
		comment: string;
	}) => Promise<void> | void;
}

export function ReviewModal({
	isOpen,
	onClose,
	providerName,
	itemName,
	onSubmit,
}: ReviewModalProps) {
	const [hoveredRating, setHoveredRating] = useState(0);

	const form = useForm({
		defaultValues: {
			rating: 0,
			comment: "",
		} as ReviewFormValues,
		validators: {
			onChange: reviewSchema,
		},
		onSubmit: async ({ value }) => {
			if (onSubmit) {
				await onSubmit({
					rating: value.rating,
					comment: value.comment.trim(),
				});
			}
			form.reset();
			onClose();
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
			title="Rate Experience"
			description={`Reviewing: ${providerName}`}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-8"
			>
				<form.Field
					name="rating"
					children={(field) => (
						<div className="flex flex-col items-center gap-4">
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5].map((star) => {
									const isFilled = star <= (hoveredRating || field.state.value);
									const Icon = isFilled ? RiStarFill : RiStarLine;
									return (
										<button
											key={star}
											type="button"
											className="transition-transform hover:scale-110 focus:outline-none"
											onMouseEnter={() => setHoveredRating(star)}
											onMouseLeave={() => setHoveredRating(0)}
											onClick={() => field.handleChange(star)}
										>
											<Icon
												className={`w-10 h-10 transition-colors ${
													isFilled
														? "fill-primary text-primary"
														: "text-muted border-border"
												}`}
											/>
										</button>
									);
								})}
							</div>
							<p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
								{field.state.value === 5
									? "Excellent"
									: field.state.value === 4
										? "Good"
										: field.state.value === 3
											? "Average"
											: field.state.value > 0
												? "Poor"
												: "Select Rating"}
							</p>
							{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 && (
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
							label="Your Feedback"
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={`Share details about your experience with ${itemName}...`}
								className="min-h-[120px] rounded-none bg-muted/10 border border-border p-4 focus:ring-2 focus:ring-primary/20 shadow-none font-mono text-sm italic"
							/>
						</FormField>
					)}
				/>

				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						variant="ghost"
						onClick={onClose}
						className="flex-1 rounded-none h-12 font-heading font-bold uppercase tracking-widest shadow-none"
					>
						Cancel
					</Button>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="flex-1 rounded-none h-12 font-heading font-bold uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary text-white"
							>
								{isSubmitting ? "Submitting..." : "Submit Review"}
							</Button>
						)}
					/>
				</div>
			</form>
		</ResponsiveModal>
	);
}
