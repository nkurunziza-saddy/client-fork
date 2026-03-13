import { RiShieldCheckLine, RiUserLine } from "@remixicon/react";
import { Package } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card as AdminCard } from "@/shared/components/admin/card";

export const SystemActions: React.FC = () => (
	<div className="space-y-8">
		<h2 className="text-2xl font-heading font-bold text-foreground uppercase tracking-tight border-b border-border pb-6">
			Admin Controls
		</h2>

		<AdminCard title="Moderation Rules" subtitle="Automatic account actions">
			<div className="space-y-8 mt-4">
				<div className="flex gap-5">
					<div className="w-12 h-12 rounded-sm bg-warning/5 flex items-center justify-center shrink-0 border border-warning/50">
						<Package size={24} className="text-warning" />
					</div>
					<div>
						<p className="text-sm font-heading font-bold text-foreground uppercase tracking-wider">
							Auto Suspend
						</p>
						<p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-[0.1em] mt-1.5 leading-none">
							3 Reports in 7 days
						</p>
					</div>
				</div>
				<div className="flex gap-5">
					<div className="w-12 h-12 rounded-sm bg-destructive/5 flex items-center justify-center shrink-0 border border-destructive/50">
						<RiUserLine size={24} className="text-destructive" />
					</div>
					<div>
						<p className="text-sm font-heading font-bold text-foreground uppercase tracking-wider">
							Delete Account
						</p>
						<p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-[0.1em] mt-1.5 leading-none">
							5 Reports or Rule Breach
						</p>
					</div>
				</div>
				<Separator className="bg-border/50" />
				<Button
					variant="outline"
					className="w-full rounded-sm border border-border font-heading font-bold uppercase tracking-widest h-12 hover:bg-muted text-[10px] shadow-none transition-all"
				>
					Configure Rules
				</Button>
			</div>
		</AdminCard>

		<div className="bg-foreground text-background border-none shadow-none overflow-hidden relative p-8 rounded-sm">
			<div className="absolute inset-0 african-pattern opacity-10 invert pointer-events-none" />
			<div className="relative z-10 text-center">
				<div className="w-14 h-14 bg-background/10 rounded-sm flex items-center justify-center mx-auto mb-6 border border-background/20">
					<RiShieldCheckLine size={28} className="text-primary" />
				</div>
				<h3 className="text-xl font-heading font-bold uppercase tracking-widest mb-3 leading-none">
					Verification
				</h3>
				<p className="text-muted-foreground text-[10px] font-bold mb-8 uppercase tracking-[0.2em] leading-none">
					8 Companies Awaiting Review
				</p>
				<Button className="w-full h-14 rounded-sm font-heading font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-none transition-all active:scale-95">
					Review Companies
				</Button>
			</div>
		</div>
	</div>
);
