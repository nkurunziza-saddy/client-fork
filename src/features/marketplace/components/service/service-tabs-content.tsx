import {
	RiBriefcaseLine,
	RiCheckDoubleLine,
	RiFileTextLine,
	RiInformationLine,
	RiMapPinLine,
} from "@remixicon/react";
import type React from "react";
import type { Service } from "@/types";
import { AddReviewDialog } from "../reviews/add-review-dialog";
import { ReviewList } from "../reviews/review-list";

interface ServiceTabsContentProps {
	service: Service;
	activeTab: string;
	trackAndNavigate?: (type: any, href: string) => void;
}

export const ServiceTabsContent: React.FC<ServiceTabsContentProps> = ({
	service,
	activeTab,
	trackAndNavigate: _trackAndNavigate,
}) => {
	if (activeTab === "overview") {
		return (
			<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<section>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center">
							<RiInformationLine className="w-4 h-4 text-slate-600" />
						</div>
						<h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-950">
							Service Overview
						</h2>
					</div>
					<div className="prose prose-slate max-w-none">
						<p className="text-slate-600 leading-relaxed text-xs">
							{service.description ||
								"Detailed description of this professional construction service will appear here. The provider hasn't updated the full overview yet."}
						</p>
					</div>
				</section>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<section className="p-6 bg-slate-50 border border-slate-200">
						<div className="flex items-center gap-3 mb-6">
							<RiCheckDoubleLine className="w-5 h-5 text-emerald-600" />
							<h3 className="text-[10px] font-black uppercase tracking-widest text-slate-950">
								What's Included
							</h3>
						</div>
						<ul className="space-y-3">
							{[
								"Professional site assessment",
								"All required equipment & tools",
								"Certified skilled technicians",
								"Workmanship guarantee",
							].map((item, i) => (
								<li key={i} className="flex items-start gap-3">
									<div className="mt-1.5 w-1.5 h-1.5 bg-slate-300 transform rotate-45" />
									<span className="text-[11px] font-bold uppercase tracking-tight text-slate-600">
										{item}
									</span>
								</li>
							))}
						</ul>
					</section>

					<section className="p-6 bg-white border border-slate-200">
						<div className="flex items-center gap-3 mb-6">
							<RiBriefcaseLine className="w-5 h-5 text-primary" />
							<h3 className="text-[10px] font-black uppercase tracking-widest text-slate-950">
								Service Experience
							</h3>
						</div>
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
									Typical Duration
								</span>
								<span className="text-[11px] font-black text-slate-950 uppercase">
									{service.duration || "Contact for estimate"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
									Standard Area
								</span>
								<span className="text-[11px] font-black text-slate-950 uppercase">
									Kigali City
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
									Availability
								</span>
								<span className="text-[11px] font-black text-slate-950 uppercase">
									Mon - Sat
								</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}

	if (activeTab === "provider") {
		return (
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				<section className="p-8 bg-slate-950 text-white rounded-none">
					<div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
						<div className="w-24 h-24 bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black uppercase tracking-tighter">
							{service.company?.name?.charAt(0) || "S"}
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-black uppercase tracking-tight mb-2">
								{service.company?.name || "Professional Provider"}
							</h3>
							<div className="flex items-center gap-4 opacity-70 mb-4">
								<div className="flex items-center gap-1.5">
									<RiMapPinLine className="w-4 h-4" />
									<span className="text-xs uppercase font-bold tracking-widest">
										Kigali, Rwanda
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<RiBriefcaseLine className="w-4 h-4" />
									<span className="text-xs uppercase font-bold tracking-widest">
										50+ Services Completed
									</span>
								</div>
							</div>
							<p className="text-sm text-slate-400 max-w-2xl leading-relaxed italic">
								"Dedicated to delivering precision construction solutions across
								Rwanda with verified expertise."
							</p>
						</div>
					</div>
				</section>
			</div>
		);
	}

	if (activeTab === "reviews") {
		return (
			<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-border/40">
					<div className="space-y-1">
						<h3 className="font-heading font-black uppercase text-xs tracking-[0.4em] text-foreground/40">
							Customer Reviews
						</h3>
						<p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
							Feedback from verified customers
						</p>
					</div>
					<div className="w-full sm:w-auto">
						<AddReviewDialog serviceId={service.id} />
					</div>
				</div>

				<ReviewList serviceId={service.id} />
			</div>
		);
	}

	return (
		<div className="py-20 text-center animate-in fade-in duration-500">
			<RiFileTextLine className="w-12 h-12 text-slate-200 mx-auto mb-4" />
			<span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
				Section Under Development
			</span>
		</div>
	);
};

// export default ServiceTabsContent;
