import { Loader2 } from "lucide-react";
import type React from "react";

export const RouteLoading: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-background/50 backdrop-blur-sm animate-in fade-in duration-500">
			<div className="relative flex items-center justify-center">
				<div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none w-20 h-20 -m-6" />
				<Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
			</div>
			<p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground animate-pulse">
				Loading...
			</p>
		</div>
	);
};

export default RouteLoading;
