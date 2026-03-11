import { RiNotification3Line } from "@remixicon/react";
import type React from "react";
import { Card as AdminCard } from "@/features/admin/components/card";

interface NotificationSettingsCardProps {
	notifications: any;
	onToggle: (
		key:
			| "emailNotifications"
			| "orderAlerts"
			| "customerMessages"
			| "systemUpdates",
	) => void;
}

export const NotificationSettingsCard: React.FC<
	NotificationSettingsCardProps
> = ({ notifications, onToggle }) => {
	type NotificationKey =
		| "emailNotifications"
		| "orderAlerts"
		| "customerMessages"
		| "systemUpdates";
	const settings: {
		key: NotificationKey;
		label: string;
		description: string;
	}[] = [
		{
			key: "emailNotifications",
			label: "Email Notifications",
			description: "Receive updates via email",
		},
		{
			key: "orderAlerts",
			label: "Order Alerts",
			description: "Get notified of new orders",
		},
		{
			key: "customerMessages",
			label: "New Messages",
			description: "Alerts for new chat messages",
		},
		{
			key: "systemUpdates",
			label: "System Updates",
			description: "Platform and maintenance news",
		},
	];

	return (
		<AdminCard
			title="Notification Settings"
			subtitle="Manage your alerts and updates"
			headerActions={<RiNotification3Line size={16} className="text-primary" />}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{settings.map(({ key, label, description }) => (
					<div
						key={key}
						className="flex items-center justify-between p-5 bg-muted/20 border border-border border-dashed rounded-sm hover:border-primary/20 transition-colors group"
					>
						<div className="min-w-0 pr-4">
							<p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
								{label}
							</p>
							<p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
								{description}
							</p>
						</div>
						<button
							onClick={() => onToggle(key)}
							className={`relative w-12 h-6 rounded-sm transition-all border ${
								notifications[key]
									? "bg-primary border-primary"
									: "bg-muted border-border"
							}`}
						>
							<div
								className={`absolute top-1 w-3 h-3 rounded-sm transition-all ${
									notifications[key]
										? "translate-x-7 bg-background"
										: "translate-x-1 bg-muted-foreground"
								}`}
							/>
						</button>
					</div>
				))}
			</div>
		</AdminCard>
	);
};
