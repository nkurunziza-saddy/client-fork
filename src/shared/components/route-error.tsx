import {
	RiAlertLine,
	RiArrowDownSLine,
	RiFileCopyLine,
	RiHomeLine,
	RiRefreshLine,
} from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RouteErrorProps {
	error: Error;
	reset: () => void;
}

export const RouteError: React.FC<RouteErrorProps> = ({ error, reset }) => {
	const [expanded, setExpanded] = useState(false);
	const [copyFeedback, setCopyFeedback] = useState(false);

	const handleCopyError = () => {
		const errorDetails = `Error Report - ${new Date().toISOString()}
📋 Message: ${error.toString()}
📍 Stack: ${error.stack || "N/A"}`;

		navigator.clipboard.writeText(errorDetails).then(() => {
			setCopyFeedback(true);
			setTimeout(() => setCopyFeedback(false), 2000);
		});
	};

	return (
		<div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 african-pattern opacity-5 pointer-events-none" />
			<div className="w-full max-w-3xl relative z-10">
				<div className="bg-background border border-border rounded-sm overflow-hidden shadow-2xl">
					<div className="bg-destructive p-8 text-destructive-foreground">
						<div className="flex items-start gap-6">
							<div className="bg-card w-full max-w-lg p-8 rounded-sm border border-border text-center shadow-lg">
								<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
									<RiAlertLine className="w-8 h-8 text-destructive" />
								</div>

								<h1 className="text-2xl font-bold font-heading uppercase text-foreground mb-2 tracking-wide">
									Route Error
								</h1>
								<p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest leading-relaxed">
									Something went wrong while loading this page
								</p>
							</div>
						</div>
					</div>

					<div className="p-8 space-y-6">
						<div className="bg-destructive/5 border-l-4 border-destructive rounded-sm p-6">
							<h2 className="text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-3">
								Error Message
							</h2>
							<p className="font-mono text-sm text-destructive break-words bg-background rounded-sm p-4 border border-destructive/10">
								{error.message || "Unknown error"}
							</p>
						</div>

						{error.stack && (
							<div className="bg-muted/30 rounded-sm border border-border overflow-hidden">
								<button
									type="button"
									onClick={() => setExpanded(!expanded)}
									className="w-full px-6 py-4 flex items-center justify-between group hover:bg-muted/50 transition-colors"
								>
									<span className="font-heading font-bold text-foreground text-xs uppercase tracking-widest">
										Technical Details
									</span>
									<RiArrowDownSLine
										size={18}
										className={cn(
											"text-muted-foreground transition-transform",
											expanded && "rotate-180",
										)}
									/>
								</button>
								{expanded && (
									<pre className="px-6 py-4 bg-foreground text-background text-[10px] overflow-x-auto font-mono whitespace-pre-wrap break-words border-t-2 border-border max-h-48 overflow-y-auto">
										{error.stack}
									</pre>
								)}
							</div>
						)}
					</div>

					<div className="bg-muted/30 border-t-2 border-border p-6 flex gap-3 flex-wrap items-center">
						<Button
							onClick={handleCopyError}
							variant="outline"
							className={cn(
								"rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 border border-border shadow-none transition-all",
								copyFeedback &&
									"bg-green-500 text-white border-green-500 hover:bg-green-600",
							)}
						>
							<RiFileCopyLine size={16} className="mr-2" />
							{copyFeedback ? "Copied" : "Copy Report"}
						</Button>

						<Button
							onClick={() => reset()}
							className="rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 shadow-none"
						>
							<RiRefreshLine size={16} className="mr-2" />
							Try Again
						</Button>

						<Link to="/" className="ml-auto">
							<Button
								variant="outline"
								className="rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 border border-border shadow-none"
							>
								<RiHomeLine size={16} className="mr-2" />
								Home
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
