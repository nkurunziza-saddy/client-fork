import { Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SecuritySection() {
	return (
		<div className="space-y-10">
			<div className="grid gap-8 max-w-2xl">
				<div className="space-y-6">
					<div className="flex items-center gap-3 mb-2">
						<Shield className="w-5 h-5 text-primary" />
						<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
							Change Password
						</h3>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								Current Password
							</label>
							<Input
								type="password"
								className="h-12 bg-muted/10 font-mono shadow-none border-border"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								New Password
							</label>
							<Input
								type="password"
								className="h-12 bg-muted/10 font-mono shadow-none border-border"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								Confirm New Password
							</label>
							<Input
								type="password"
								className="h-12 bg-muted/10 font-mono shadow-none border-border"
							/>
						</div>
						<Button className="font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-8 rounded-sm shadow-xl shadow-primary/20">
							Update Password
						</Button>
					</div>
				</div>

				<div className="pt-8 border-t border-border">
					<div className="flex items-center gap-3 mb-6">
						<Smartphone className="w-5 h-5 text-primary" />
						<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
							Account Access
						</h3>
					</div>
					<div className="p-6 bg-muted/20 border border-border border-dashed rounded-sm flex items-center justify-between">
						<div>
							<p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
								Two-Factor Auth
							</p>
							<p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">
								Add an extra layer of security
							</p>
						</div>
						<Switch className="rounded-none scale-90" />
					</div>
				</div>
			</div>
		</div>
	);
}
