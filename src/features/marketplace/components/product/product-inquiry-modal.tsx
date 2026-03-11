import type React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveModal } from "@/shared/components/responsive-modal";

interface ProductInquiryModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	productName: string;
	messageText: string;
	setMessageText: (text: string) => void;
	onSubmit: () => void;
}

export const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({
	isOpen,
	onOpenChange,
	productName,
	messageText,
	setMessageText,
	onSubmit,
}) => {
	return (
		<ResponsiveModal
			open={isOpen}
			onOpenChange={onOpenChange}
			title="Material Inquiry"
			description={`Initiate a professional inquiry regarding "${productName}".`}
		>
			<div className="space-y-6">
				<p className="text-sm text-muted-foreground leading-relaxed">
					Technical responses are typically generated within 2 hours.
				</p>
				<Textarea
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					placeholder="Describe your requirements or volume needs..."
					className="min-h-32 rounded-none border-border bg-muted/5 p-4 resize-none focus-visible:ring-1 focus-visible:ring-primary text-sm"
				/>
				<div className="flex flex-col sm:flex-row justify-end gap-3">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="rounded-none text-[10px] uppercase font-black tracking-widest h-11 px-6 order-2 sm:order-1"
					>
						Cancel
					</Button>
					<Button
						className="rounded-none text-[10px] uppercase font-black tracking-widest h-11 px-8 bg-primary text-primary-foreground order-1 sm:order-2"
						disabled={!messageText.trim()}
						onClick={onSubmit}
					>
						Submit Inquiry
					</Button>
				</div>
			</div>
		</ResponsiveModal>
	);
};
