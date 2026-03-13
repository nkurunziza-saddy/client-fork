import { RiStore2Line } from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { Product } from "@/types";

interface SupplierProductsTableProps {
	products: Product[];
	supplierId: string;
}

export function SupplierProductsTable({
	products,
	supplierId,
}: SupplierProductsTableProps) {
	const navigate = useNavigate();

	if (products.length === 0) {
		return (
			<Empty className="py-12 border border-dashed border-border rounded-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<RiStore2Line className="w-4 h-4 text-primary" />
					</EmptyMedia>
					<EmptyTitle className="text-xl font-display font-black uppercase">
						No products found
					</EmptyTitle>
					<EmptyDescription className="uppercase tracking-widest text-[10px]">
						This supplier hasn't listed any products yet.
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
						<th className="py-3">Stock</th>
						<th className="py-3">Status</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr
							key={product.id}
							onClick={() =>
								navigate({
									to: "/admin/suppliers/$supplierId/product/$productId",
									params: { supplierId, productId: product.id },
								})
							}
							className="cursor-pointer border-b border-border/50 hover:bg-muted/30"
						>
							<td className="py-3 font-medium">{product.name}</td>
							<td className="py-3 text-muted-foreground">
								{product.category?.name ?? "-"}
							</td>
							<td className="py-3">
								RWF {(product.variants?.[0]?.price ?? 0).toLocaleString()}
							</td>
							<td className="py-3">{product.variants?.[0]?.stock ?? 0}</td>
							<td className="py-3">
								<Badge
									variant={product.isActive ? "success" : "secondary"}
									className="uppercase text-[10px] tracking-wider"
								>
									{product.isActive ? "active" : "inactive"}
								</Badge>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
