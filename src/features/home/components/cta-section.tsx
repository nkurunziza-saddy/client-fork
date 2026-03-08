import {
	RiArrowRightLine,
	RiBriefcaseLine,
	RiPagesLine,
} from "@remixicon/react";
import { Link, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
	const navigate = useNavigate();

	return (
		<section className="relative py-32 md:py-48 overflow-hidden bg-background border-y border-border/20">
			<div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
			<div className="absolute top-0 right-0 w-1/2 h-full bg-primary/2 -skew-x-12 translate-x-1/4 pointer-events-none" />

			<div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-10">
				<div className="grid lg:grid-cols-12 gap-16 items-center">
					<div className="lg:col-span-5">
						<div className="inline-flex items-center gap-3 mb-10">
							<div className="w-8 h-px bg-primary" />
							<span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
								Get Connected
							</span>
						</div>

						<h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground mb-8 tracking-tighter uppercase leading-[0.8]">
							Source Everything
							<br />
							For Construction
						</h2>

						<p className="text-muted-foreground text-xl leading-relaxed max-w-md font-medium mb-12 border-l-2 border-primary/20 pl-6">
							Browse Rwanda's largest network of construction suppliers,
							materials, and services. Connect directly with verified providers.
						</p>

						<div className="flex gap-4">
							<Button
								size="lg"
								className="bg-primary text-white hover:bg-primary/90 rounded-none h-14 px-10 font-heading font-black uppercase tracking-widest text-xs"
								render={(props) => (
									<Link {...props} to="/products">
										Enter Marketplace
									</Link>
								)}
							/>
						</div>
					</div>

					<div className="lg:col-span-1" />

					<div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
						<div
							onClick={() =>
								navigate({
									to: "/products",
								})
							}
							className="group cursor-pointer bg-muted/20 border border-border/40 hover:border-primary/50 p-10 rounded-none transition-all duration-500 hover:bg-background relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-1/2 translate-x-1/2 rotate-45 group-hover:bg-primary/10 transition-colors" />

							<div className="relative z-10">
								<div className="text-primary mb-12">
									<RiPagesLine className="w-10 h-10" />
								</div>

								<h3 className="text-2xl font-display font-black text-foreground mb-4 uppercase tracking-tight leading-none text-primary">
									Browse
									<br />
									Materials
								</h3>
								<p className="text-muted-foreground text-xs leading-relaxed mb-10 font-bold uppercase tracking-widest opacity-60">
									Building Materials · Tools · Equipment
								</p>

								<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
									Explore Products{" "}
									<RiArrowRightLine className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
								</div>
							</div>
						</div>

						<div
							onClick={() =>
								navigate({
									to: "/services",
								})
							}
							className="group cursor-pointer bg-muted/20 border border-border/40 hover:border-primary/50 p-10 rounded-none transition-all duration-500 hover:bg-background relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-1/2 translate-x-1/2 rotate-45 group-hover:bg-primary/10 transition-colors" />

							<div className="relative z-10">
								<div className="text-primary mb-12">
									<RiBriefcaseLine className="w-10 h-10" />
								</div>

								<h3 className="text-2xl font-display font-black text-foreground mb-4 uppercase tracking-tight leading-none text-primary">
									Find
									<br />
									Services
								</h3>
								<p className="text-muted-foreground text-xs leading-relaxed mb-10 font-bold uppercase tracking-widest opacity-60">
									Contractors · Engineering · Logistics
								</p>

								<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
									Explore Services{" "}
									<RiArrowRightLine className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
