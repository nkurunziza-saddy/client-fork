import { RiPulseLine } from "@remixicon/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card as AdminCard } from "@/features/admin/components/card";
import { AdminTable } from "@/features/admin/components/table";

export const ActivityLogsCard: React.FC = () => {
	const activities = [
		{
			action: "LOGIN",
			device: "Chrome / Windows 10",
			time: "2 HOURS AGO",
		},
		{
			action: "PASSWORD_CHANGE",
			device: "Safari / iPhone",
			time: "1 DAY AGO",
		},
		{
			action: "LOGIN",
			device: "Firefox / macOS",
			time: "3 DAYS AGO",
		},
		{
			action: "PROFILE_UPDATE",
			device: "Chrome / Windows 10",
			time: "5 DAYS AGO",
		},
	];

	return (
		<AdminCard
			title="Activity Logs"
			subtitle="Recent account activity"
			headerActions={<RiPulseLine size={16} className="text-primary" />}
		>
			<AdminTable headers={["Action", "Device", "Time"]}>
				{activities.map((activity) => (
					<tr
						key={`${activity.action}-${activity.time}`}
						className="hover:bg-muted/50 transition-colors"
					>
						<td className="px-4 py-4">
							<Badge
								variant="outline"
								className="bg-primary/5 text-primary border-primary/20 font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm"
							>
								{activity.action}
							</Badge>
						</td>
						<td className="px-4 py-4 text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest">
							{activity.device}
						</td>
						<td className="px-4 py-4 text-[10px] text-foreground font-mono font-black text-right uppercase tracking-tighter">
							{activity.time}
						</td>
					</tr>
				))}
			</AdminTable>
		</AdminCard>
	);
};
