import { RiStore2Line } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { Service } from "@/types";

interface SupplierServicesTableProps {
	services: Service[];
}

export function SupplierServicesTable({ services }: SupplierServicesTableProps) {
	if (services.length === 0) {
		return (
			<Empty className="py-12 border border-dashed border-border rounded-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<RiStore2Line className="w-4 h-4 text-primary" />
					</EmptyMedia>
					<EmptyTitle className="text-xl font-display font-black uppercase">
						No services found
					</EmptyTitle>
					<EmptyDescription className="uppercase tracking-widest text-[10px]">
						This supplier hasn't listed any services yet.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
						<th className="py-3">Name</th>
						<th className="py-3">Category</th>
						<th className="py-3">Price</th>
						<th className="py-3">Status</th>
					</tr>
				</thead>
				<tbody>
					{services.map((service) => (
						<tr
							key={service.id}
							className="border-b border-border/50 hover:bg-muted/30"
						>
							<td className="py-3 font-medium">{service.name}</td>
							<td className="py-3 text-muted-foreground">
								{service.category?.name ?? "-"}
							</td>
							<td className="py-3">
								RWF {(service.price ?? 0).toLocaleString()}
							</td>
							<td className="py-3">
								<Badge
									variant={service.isActive ? "success" : "secondary"}
									className="uppercase text-[10px] tracking-wider"
								>
									{service.isActive ? "active" : "inactive"}
								</Badge>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
