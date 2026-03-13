import { Package } from "lucide-react";
import { RiStore2Line } from "@remixicon/react";
import { StatCard as AdminStatCard } from "@/shared/components/admin/stat-card";
import { StatsGrid } from "@/shared/components";

interface InventoryStatsProps {
	listings: any[];
}

export function InventoryStats({ listings }: InventoryStatsProps) {
	const prods = listings.filter((l) => l.itemType === "PRODUCT");
	const servs = listings.filter((l) => l.itemType === "SERVICE");
	const activeListings = listings.filter((l) => l.isActive).length;

	return (
		<StatsGrid columns={4}>
			<AdminStatCard
				label="Listings"
				value={listings.length}
				icon={Package}
				bgColor="bg-primary/5"
				color="text-primary"
			/>
			<AdminStatCard
				label="Active"
				value={activeListings}
				icon={RiStore2Line}
				bgColor="bg-success/5"
				color="text-success"
			/>
			<AdminStatCard
				label="Products"
				value={prods.length}
				icon={Package}
				bgColor="bg-info/5"
				color="text-info"
			/>
			<AdminStatCard
				label="Services"
				value={servs.length}
				icon={RiStore2Line}
				bgColor="bg-primary/5"
				color="text-primary"
			/>
		</StatsGrid>
	);
}
