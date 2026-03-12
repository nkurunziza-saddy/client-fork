import {
	RiAlertLine,
	RiArrowRightLine,
	RiCheckboxCircleLine,
	RiCloseCircleLine,
	RiFlagLine,
} from "@remixicon/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card as AdminCard } from "@/features/admin/components/card";

interface Report {
	id: string;
	target: string;
	type: string;
	reason: string;
	evidence: string;
	status: string;
	count: number;
	time: string;
}

interface ModerationQueueProps {
	reports: Report[];
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({
	reports,
}) => (
	<div className="lg:col-span-2 space-y-8">
		<div className="flex items-center justify-between border-b border-border pb-6">
			<div className="flex items-center gap-4">
				<h2 className="text-2xl font-heading font-bold text-foreground uppercase tracking-tight">
					Moderation Queue
				</h2>
				<Badge className="rounded-sm bg-destructive/10 text-destructive border border-destructive/20 font-heading font-bold uppercase text-[10px] tracking-widest px-2.5 py-1">
					Urgent
				</Badge>
			</div>
			<Button
				variant="ghost"
				className="font-heading font-bold uppercase text-xs tracking-widest text-muted-foreground hover:text-primary"
			>
				View All Reports
			</Button>
		</div>

		<div className="space-y-6">
			{reports.length === 0 ? (
				<AdminCard>
					<div className="rounded-sm border border-dashed border-border bg-muted/5 px-6 py-10 text-center text-sm text-muted-foreground">
						No moderation alerts right now.
					</div>
				</AdminCard>
			) : (
				reports.map((report) => (
					<AdminCard
						key={report.id}
						noPadding
						className="hover:border-destructive/50 transition-all duration-300 shadow-sm hover:shadow-md"
					>
						<div className="flex flex-col md:flex-row">
							<div className="p-8 flex-1">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-10 h-10 rounded-sm bg-destructive/5 flex items-center justify-center border border-destructive/50 shrink-0">
										<RiFlagLine size={20} className="text-destructive" />
									</div>
									<div className="flex flex-wrap gap-2 items-center">
										<span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase">
											Report_{report.id}
										</span>
										<Badge
											variant="secondary"
											className="rounded-sm bg-muted/50 text-muted-foreground border border-border/50 uppercase text-[9px] font-heading font-bold tracking-widest px-2 py-0.5"
										>
											Type: {report.type}
										</Badge>
									</div>
								</div>

								<h3 className="text-xl font-heading font-bold text-foreground mb-2 uppercase tracking-tight">
									{report.target}
								</h3>
								<p className="text-sm font-bold text-destructive mb-6 font-heading uppercase tracking-widest">
									{report.reason}
								</p>

								<div className="flex items-center gap-8 text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest">
									<div className="flex items-center gap-2">
										<RiAlertLine size={14} className="text-destructive" />
										<span>{report.count} Violations</span>
									</div>
									<div className="flex items-center gap-2">
										<RiArrowRightLine
											size={14}
											className="text-muted-foreground/40"
										/>
										<span>Reported {report.time}</span>
									</div>
								</div>
							</div>

							<div className="bg-muted/10 p-8 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-4 w-full md:w-72">
								<Button className="w-full rounded-sm font-heading font-bold uppercase tracking-widest bg-foreground hover:bg-foreground/90 text-background h-12 text-[10px] shadow-none">
									Review Account
								</Button>
								<div className="flex gap-3">
									<Button
										variant="outline"
										className="flex-1 rounded-sm border border-border hover:bg-success/5 hover:text-success hover:border-success/20 h-12 shadow-none transition-all"
										title="Clear Report"
									>
										<RiCheckboxCircleLine size={20} className="mx-auto" />
									</Button>
									<Button
										variant="outline"
										className="flex-1 rounded-sm border border-border hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 h-12 shadow-none transition-all"
										title="Suspend Account"
									>
										<RiCloseCircleLine size={20} className="mx-auto" />
									</Button>
								</div>
							</div>
						</div>
					</AdminCard>
				))
			)}
		</div>
	</div>
);
