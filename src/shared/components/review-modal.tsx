import { RiStarFill, RiStarLine } from "@remixicon/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [hoveredRating, setHoveredRating] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		try {
			setSubmitting(true);
			if (onSubmit) {
				await onSubmit({
					rating,
					comment: comment.trim(),
				});
			}
			setRating(0);
			setComment("");
			onClose();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ResponsiveModal
			open={isOpen}
			onOpenChange={onClose}
			title="Rate Experience"
			description={`Reviewing: ${providerName}`}
		>
			<div className="space-y-8">
				<div className="flex flex-col items-center gap-4">
					<div className="flex gap-2">
						{[1, 2, 3, 4, 5].map((star) => {
							const isFilled = star <= (hoveredRating || rating);
							const Icon = isFilled ? RiStarFill : RiStarLine;
							return (
								<button
									key={star}
									className="transition-transform hover:scale-110 focus:outline-none"
									onMouseEnter={() => setHoveredRating(star)}
									onMouseLeave={() => setHoveredRating(0)}
									onClick={() => setRating(star)}
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
						{rating === 5
							? "Excellent"
							: rating === 4
								? "Good"
								: rating === 3
									? "Average"
									: rating > 0
										? "Poor"
										: "Select Rating"}
					</p>
				</div>

				<div className="space-y-2">
					<label className="text-[10px] font-black text-foreground uppercase tracking-widest ml-1">
						Your Feedback
					</label>
					<Textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder={`Share details about your experience with ${itemName}...`}
						className="min-h-[120px] rounded-none bg-muted/10 border border-border p-4 focus:ring-2 focus:ring-primary/20 shadow-none font-mono text-sm italic"
					/>
				</div>

				<div className="flex gap-3 pt-4">
					<Button
						variant="ghost"
						onClick={onClose}
						className="flex-1 rounded-none h-12 font-heading font-bold uppercase tracking-widest shadow-none"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={rating === 0 || submitting}
						className="flex-1 rounded-none h-12 font-heading font-bold uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary text-white"
					>
						{submitting ? "Submitting..." : "Submit Review"}
					</Button>
				</div>
			</div>
		</ResponsiveModal>
	);
}
