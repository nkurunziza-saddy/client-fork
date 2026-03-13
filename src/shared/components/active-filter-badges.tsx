import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

export interface FilterBadgeItem {
	id: string;
	label: string;
	onRemove: () => void;
}

interface ActiveFilterBadgesProps {
	items: FilterBadgeItem[];
	className?: string;
}

export const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
	items,
	className,
}) => {
	if (!items.length) return null;

	return (
		<div className={`flex flex-wrap gap-2 items-center mt-2 ${className}`}>
			{items.map((item) => (
				<Badge
					key={item.id}
					variant="secondary"
					className="gap-2 rounded-none text-[9px] font-bold uppercase tracking-widest pl-3 pr-1.5 h-7 bg-muted/50 border-border/10"
				>
					{item.label}
					<button
						type="button"
						onClick={item.onRemove}
						aria-label={`Remove ${item.label} filter`}
					>
						<X className="w-3.5 h-3.5 hover:text-destructive cursor-pointer transition-colors" />
					</button>
				</Badge>
			))}
		</div>
	);
};
