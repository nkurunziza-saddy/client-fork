import { RiShareForwardLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { cn, shareContent } from "@/lib/utils";
import { ContactActions } from "@/shared/components/contact-actions";

interface ProductSidebarProps {
	company?: {
		id: string;
		name: string;
		district?: string;
		isVerified?: boolean;
		phone?: string;
		email?: string;
	};
	productName?: string;
	onSupplierClick: (id: string) => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
	company,
	productName,
	onSupplierClick,
}) => {
	const handleShare = () => {
		shareContent({
			title: productName || "Construction Material",
			text: `Check out this product: ${productName}`,
			url: window.location.href,
		});
	};

	return (
		<div className="lg:col-span-4 space-y-8 sticky top-24">
			{/* Provider ID Card */}
			<div className="border border-border bg-background rounded-none relative overflow-hidden group">
				<div className="p-8">
					<h3 className="text-[9px] font-heading font-black uppercase text-muted-foreground mb-8 tracking-[0.4em] flex justify-between items-center">
						<span>Supplier Verification</span>
						<span className="text-primary flex items-center gap-1.5">
							<div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
							LIVE
						</span>
					</h3>

					<div className="flex items-center gap-6 mb-10">
						<div className="w-20 h-20 bg-muted border border-border rounded-none flex items-center justify-center text-3xl font-display font-black text-foreground relative group-hover:scale-105 transition-transform duration-500">
							<div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 translate-y-1" />
							{company?.name?.charAt(0) ?? "S"}
						</div>
						<div className="space-y-1">
							<h4 className="font-display font-black text-lg uppercase tracking-tighter text-foreground leading-[0.85]">
								{company?.name ?? "Karibu Seller"}
							</h4>
							<p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
								{company?.district ?? "Regional Supplier"}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-px bg-border mb-8">
						<div className="bg-background p-4">
							<span className="block text-[8px] uppercase font-black text-muted-foreground tracking-[0.3em] mb-2">
								Verification Status
							</span>
							<span
								className={cn(
									"block text-sm font-bold font-heading",
									company?.isVerified ? "text-success" : "text-warning",
								)}
							>
								{company?.isVerified ? "OFFICIALLY VERIFIED" : "PENDING REVIEW"}
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full rounded-none border-border h-12 font-heading font-black uppercase tracking-[0.3em] text-[9px] hover:bg-foreground hover:text-background transition-colors mb-8"
						onClick={() => company?.id && onSupplierClick(company.id)}
					>
						View Supplier Profile
					</Button>

					<div className="space-y-4">
						<span className="block text-[8px] uppercase font-black text-muted-foreground tracking-[0.4em] mb-4">
							Contact Supplier
						</span>
						<div className="flex flex-col gap-3">
							<ContactActions
								phone={company?.phone}
								whatsapp={company?.phone}
								email={company?.email}
								companyName={company?.name}
								companyId={company?.id}
								className="w-full flex-col [&>button]:w-full"
							/>
							<Button
								variant="outline"
								className="w-full rounded-none border-border h-11 flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors"
								onClick={handleShare}
							>
								<RiShareForwardLine className="w-4 h-4" />
								<span className="text-[9px] font-black uppercase tracking-widest">
									Share
								</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
