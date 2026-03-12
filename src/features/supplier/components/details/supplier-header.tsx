import { MapPin, ShieldCheck, Star } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/types";
import { SupplierActions } from "./supplier-actions";

interface SupplierHeaderProps {
	company: Company;
	location: string;
	rating: number;
	onContactClick?: () => void;
}

export const SupplierHeader: React.FC<SupplierHeaderProps> = ({
	company,
	location,
	rating,
	onContactClick,
}) => {
	return (
		<div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
			{/* Logo Column */}
			<div className="w-full aspect-square border border-border bg-muted/10 flex items-center justify-center text-4xl font-heading font-black text-muted-foreground overflow-hidden relative group">
				{company?.logoUrl ? (
					<img
						src={company?.logoUrl}
						alt={company?.name}
						className="w-full h-full object-cover"
						onError={(e) => {
							e.currentTarget.src = "/image-fallback.svg";
						}}
					/>
				) : (
					<span className="group-hover:scale-110 transition-transform duration-500">
						{company?.name?.charAt(0) || "C"}
					</span>
				)}
			</div>

			{/* Info Column */}
			<div className="space-y-6">
				<div>
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
						<h1 className="text-2xl md:text-3xl font-heading font-bold uppercase text-foreground">
							{company?.name}
						</h1>
						<div className="flex items-center gap-2">
							{company?.isVerified && (
								<Badge variant="success" className="rounded-sm">
									<ShieldCheck className="w-3 h-3" />
									Verified Supplier
								</Badge>
							)}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
						<div className="flex items-center gap-1.5">
							<MapPin className="w-4 h-4 text-primary" />
							<span className="font-medium">{location}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="flex text-primary">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star key={star} className="w-3.5 h-3.5 fill-primary" />
								))}
							</div>
							<span className="font-bold text-foreground">
								{rating.toFixed(1)}
							</span>
							<span className="text-xs">
								({company.reviewCount || 203} reviews)
							</span>
						</div>
					</div>

					<p className="text-muted-foreground leading-relaxed max-w-3xl">
						{company.description ||
							"Leading supplier of construction materials and specialized services across Rwanda. Providing high-quality supplies and dedicated support for your projects."}
					</p>
				</div>

				{onContactClick && (
					<SupplierActions company={company} onContactClick={onContactClick} />
				)}
			</div>
		</div>
	);
};
