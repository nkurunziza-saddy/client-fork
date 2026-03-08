import type React from "react";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { AddReviewDialog } from "../reviews/add-review-dialog";
import { ReviewList } from "../reviews/review-list";

interface ProductTabsContentProps {
	description: string;
	keyFacts: Array<{ label: string; value: string }>;
	variantName?: string;
	variantSku?: string;
}

export const ProductTabsContent: React.FC<ProductTabsContentProps> = ({
	description,
	keyFacts,
	variantName,
	variantSku,
}) => {
	return (
		<>
			<TabsContent value="overview" className="mt-12 space-y-12">
				<div className="space-y-6">
					<h3 className="font-heading font-black uppercase text-xs tracking-[0.4em] text-foreground/40 pb-4 border-b border-border/40">
						Product Information
					</h3>
					<p className="text-xs leading-relaxed text-muted-foreground max-w-2xl">
						{description ||
							"Details and description for this product are currently being finalized."}
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-16">
					<div className="space-y-8">
						<h3 className="font-heading font-bold uppercase text-xs tracking-[0.4em] text-foreground/40 pb-4 border-b border-border/40">
							Product Details
						</h3>
						<div className="grid gap-6">
							{keyFacts.map((fact) => (
								<div
									key={fact.label}
									className="flex justify-between items-end group"
								>
									<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
										{fact.label}
									</span>
									<div className="flex-1 border-b border-dashed border-border/60 mx-4 mb-1 group-hover:border-primary/40 transition-colors" />
									<span className="text-xs font-bold font-heading whitespace-nowrap">
										{fact.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</TabsContent>

			<TabsContent value="specs" className="mt-12">
				<div className="border border-border p-8 bg-muted/5">
					<div className="flex justify-between items-start border-b border-border/40 pb-6 mb-6">
						<div>
							<h4 className="font-display font-bold text-lg uppercase tracking-tighter">
								{variantName || "Standard Variant"}
							</h4>
							<span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">
								{variantSku || "SKU: PENDING"}
							</span>
						</div>
						<Badge
							variant="outline"
							className="rounded-none border-primary text-primary font-bold text-[9px] tracking-widest uppercase"
						>
							IN STOCK
						</Badge>
					</div>
					<p className="text-xs text-muted-foreground leading-relaxed">
						Specifications for this product are based on standard information.
						For custom orders, please contact the supplier directly.
					</p>
				</div>
			</TabsContent>

			<TabsContent value="reviews" className="mt-12 space-y-12">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-border/40">
					<div className="space-y-1">
						<h3 className="font-heading font-black uppercase text-xs tracking-[0.4em] text-foreground/40">
							Customer Reviews
						</h3>
						<p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
							Feedback from verified customers
						</p>
					</div>
					<div className="w-full sm:w-auto">
						<AddReviewDialog
							productId={keyFacts.find((f) => f.label === "ID")?.value || ""}
						/>
					</div>
				</div>

				<ReviewList
					productId={keyFacts.find((f) => f.label === "ID")?.value || ""}
				/>
			</TabsContent>
		</>
	);
};
