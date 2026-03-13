import { RiShieldCheckLine, RiStore2Line, RiUserLine } from "@remixicon/react";
import { StatCard } from "@/shared/components/admin/stat-card";

interface SupplierStatsProps {
	stats: {
		productCount: number;
		serviceCount: number;
		memberSince: string;
		visits: number;
	};
}

export function SupplierStats({ stats }: SupplierStatsProps) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			<StatCard
				label="Products"
				value={stats.productCount}
				icon={RiStore2Line}
				bgColor="bg-info/5"
				color="text-info"
			/>
			<StatCard
				label="Services"
				value={stats.serviceCount}
				icon={RiUserLine}
				bgColor="bg-info/5"
				color="text-info"
			/>
			<StatCard
				label="Visits"
				value={stats.visits}
				icon={RiUserLine}
				bgColor="bg-warning/5"
				color="text-warning"
			/>
			<StatCard
				label="Member Since"
				value={stats.memberSince}
				icon={RiShieldCheckLine}
				bgColor="bg-success/5"
				color="text-success"
			/>
		</div>
	);
}
