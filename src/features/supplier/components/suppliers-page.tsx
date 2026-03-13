import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import SupplierListing from "./supplier-listing";

export function SuppliersPage() {
	const navigate = useNavigate();

	const handleSupplierClick = useCallback(
		(supplierId: string) => {
			navigate({
				to: "/suppliers/$supplierId",
				params: { supplierId },
			});
		},
		[navigate],
	);

	return <SupplierListing onSupplierClick={handleSupplierClick} />;
}
