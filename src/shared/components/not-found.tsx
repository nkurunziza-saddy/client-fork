import { RiArrowLeftLine, RiErrorWarningLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export const NotFound: React.FC = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

			<div className="relative z-10 text-center max-w-md w-full">
				<div className="w-24 h-24 bg-destructive/10 text-destructive mx-auto flex items-center justify-center rounded-none rotate-45 mb-12 border border-destructive/20 shadow-2xl shadow-destructive/10">
					<RiErrorWarningLine className="w-12 h-12 -rotate-45" />
				</div>

				<h1 className="text-8xl font-display font-black text-foreground mb-4 uppercase tracking-tighter leading-none">
					404
				</h1>

				<div className="flex items-center justify-center gap-3 mb-8">
					<div className="w-10 h-px bg-primary" />
					<p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
						Page Not Found
					</p>
					<div className="w-10 h-px bg-primary" />
				</div>

				<p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-sm mx-auto">
					The page you're looking for has been moved or doesn't exist.
				</p>

				<div className="flex flex-col gap-3">
					<Link to="/">
						<Button className="w-full h-14 rounded-none font-display font-black uppercase text-[10px] tracking-[0.3em] gap-2 border-none shadow-xl shadow-primary/20">
							<RiArrowLeftLine size={16} />
							Back to Home
						</Button>
					</Link>
					<Link to={ROUTES.PUBLIC.PRODUCTS}>
						<Button
							variant="outline"
							className="h-12 border-border/40 bg-background/50 px-8 px-10 font-heading text-[11px] font-black uppercase tracking-widest backdrop-blur-md transition-all hover:bg-muted/50 w-full"
						>
							Browse Products
						</Button>
					</Link>
				</div>
			</div>

			<div className="absolute bottom-8 left-0 right-0 text-center">
				<span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
					AFRIKAMARKET // 404 ERROR
				</span>
			</div>
		</div>
	);
};

export default NotFound;
