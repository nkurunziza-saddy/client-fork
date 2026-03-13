import { RiNotification3Line } from "@remixicon/react";
import { Globe, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function NotificationsSection() {
	return (
		<div className="space-y-10">
			<div className="grid gap-6 max-w-2xl">
				<div className="space-y-6">
					<div className="flex items-center gap-3 mb-2">
						<RiNotification3Line className="w-5 h-5 text-primary" />
						<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
							Alert Preferences
						</h3>
					</div>
					<div className="space-y-4">
						{[
							{
								label: "Email Alerts",
								desc: "Get notified via email for new inquiries",
								icon: Mail,
							},
							{
								label: "SMS Alerts",
								desc: "Get phone alerts for high-priority leads",
								icon: Smartphone,
							},
							{
								label: "Browser Alerts",
								desc: "Desktop notifications for live dashboard activity",
								icon: Globe,
							},
						].map((n) => (
							<div
								key={n.label}
								className="p-6 bg-muted/20 border border-border border-dashed rounded-sm flex items-center justify-between hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-background flex items-center justify-center text-muted-foreground/40 border border-border">
										<n.icon className="w-4 h-4" />
									</div>
									<div>
										<p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
											{n.label}
										</p>
										<p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">
											{n.desc}
										</p>
									</div>
								</div>
								<Switch className="rounded-none scale-90" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
