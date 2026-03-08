import { RiStarFill, RiStarLine } from "@remixicon/react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReviewMutation } from "@/services/api/reviews";
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
	const [rating, setRating] = React.useState(5);
	const [comment, setComment] = React.useState("");
	const [createReview, { isLoading }] = useCreateReviewMutation();

	const handleSubmit = async () => {
		try {
			await createReview({
				rating,
				comment,
				productId,
				serviceId,
				companyId,
			}).unwrap();
			toast.success("Review submitted successfully.");
			setOpen(false);
			setComment("");
			setRating(5);
		} catch (err) {
			console.error("Failed to submit review:", err);
			toast.error("Failed to submit review.");
		}
	};

	return (
		<ResponsiveModal
			open={open}
			onOpenChange={setOpen}
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
			<div className="space-y-6">
				<div className="space-y-4">
					<span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
						Rating
					</span>
					<div className="flex gap-2">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onClick={() => setRating(star)}
								className="focus:outline-none transition-transform active:scale-90"
							>
								{star <= rating ? (
									<RiStarFill className="w-8 h-8 text-primary" />
								) : (
									<RiStarLine className="w-8 h-8 text-muted-foreground/20" />
								)}
							</button>
						))}
					</div>
				</div>

				<div className="space-y-4">
					<span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
						Your Review
					</span>
					<Textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Describe quality, lead times, and reliability..."
						className="rounded-none border-border focus:border-primary/50 min-h-[120px] text-sm leading-relaxed"
					/>
				</div>

				<Button
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-full h-12 rounded-none bg-primary text-primary-foreground font-heading font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
				>
					{isLoading ? "Submitting..." : "Submit Review"}
				</Button>
			</div>
		</ResponsiveModal>
	);
};
