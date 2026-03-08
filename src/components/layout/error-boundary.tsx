import {
	RiAlertLine,
	RiArrowDownSLine,
	RiFileCopyLine,
	RiHomeLine,
	RiRefreshLine,
} from "@remixicon/react";
import React, { type ReactElement, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: { componentStack: string } | null;
	expandedSections: {
		stackTrace: boolean;
		componentStack: boolean;
	};
	copyFeedback: boolean;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	private copyTimeoutId: ReturnType<typeof setTimeout> | null = null;

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			expandedSections: {
				stackTrace: false,
				componentStack: false,
			},
			copyFeedback: false,
		};
	}

	static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
		console.error("🚨 Error caught by ErrorBoundary:", error);
		this.setState({ error, errorInfo });
	}

	componentWillUnmount() {
		if (this.copyTimeoutId) {
			clearTimeout(this.copyTimeoutId);
		}
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			expandedSections: { stackTrace: false, componentStack: false },
		});
	};

	handleCopyError = () => {
		if (this.state.error && this.state.errorInfo) {
			const errorDetails = `Error Report - ${new Date().toISOString()}
📋 Message: ${this.state.error.toString()}
📍 Stack: ${this.state.error.stack || "N/A"}
🔍 Component Stack: ${this.state.errorInfo.componentStack}`;

			navigator.clipboard.writeText(errorDetails).then(() => {
				this.setState({ copyFeedback: true });
				this.copyTimeoutId = setTimeout(
					() => this.setState({ copyFeedback: false }),
					2000,
				);
			});
		}
	};

	toggleSection = (section: "stackTrace" | "componentStack") => {
		this.setState((prevState) => ({
			expandedSections: {
				...prevState.expandedSections,
				[section]: !prevState.expandedSections[section],
			},
		}));
	};

	render(): ReactElement | ReactNode {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
					<div className="absolute inset-0 african-pattern opacity-5 pointer-events-none" />
					<div className="w-full max-w-3xl relative z-10">
						<div className="bg-background border border-border rounded-sm overflow-hidden">
							<div className="bg-destructive p-8 text-destructive-foreground">
								<div className="flex items-start gap-6">
									<div className="bg-card w-full max-w-lg p-8 rounded-sm border border-border text-center">
										<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
											<RiAlertLine className="w-8 h-8 text-destructive" />
										</div>

										<h1 className="text-2xl font-bold font-heading uppercase text-foreground mb-4 tracking-wide">
											An Error Occurred
										</h1>
										<p className="text-background/80 font-medium uppercase text-xs tracking-widest">
											The application encountered an unexpected error
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
										{this.state.error?.toString() || "Unknown error"}
									</p>
								</div>

								{this.state.error?.stack && (
									<div className="bg-muted/30 rounded-sm border border-border overflow-hidden">
										<button
											type="button"
											onClick={() => this.toggleSection("stackTrace")}
											className="w-full px-6 py-4 flex items-center justify-between group hover:bg-muted/50 transition-colors"
										>
											<span className="font-heading font-bold text-foreground text-xs uppercase tracking-widest">
												Error Details (Stack Trace)
											</span>
											<RiArrowDownSLine
												size={18}
												className={cn(
													"text-muted-foreground transition-transform",
													this.state.expandedSections.stackTrace &&
														"rotate-180",
												)}
											/>
										</button>
										{this.state.expandedSections.stackTrace && (
											<pre className="px-6 py-4 bg-foreground text-background text-[10px] overflow-x-auto font-mono whitespace-pre-wrap break-words border-t-2 border-border max-h-48 overflow-y-auto">
												{this.state.error.stack}
											</pre>
										)}
									</div>
								)}

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-muted/20 border border-border border-dashed rounded-sm p-4">
										<p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">
											Time of Error
										</p>
										<p className="font-mono text-[10px] text-foreground">
											{new Date().toISOString()}
										</p>
									</div>
									<div className="bg-muted/20 border border-border border-dashed rounded-sm p-4 md:col-span-2">
										<p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">
											Page URL
										</p>
										<p className="font-mono text-[10px] text-foreground break-all">
											{typeof window !== "undefined"
												? window.location.href
												: "N/A"}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-muted/30 border-t-2 border-border p-6 flex gap-3 flex-wrap">
								<Button
									onClick={this.handleCopyError}
									variant="outline"
									className={cn(
										"rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 border border-border shadow-none",
										"rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 border border-border shadow-none",
										this.state.copyFeedback &&
											"bg-success text-success-foreground border-success hover:bg-success",
									)}
								>
									<RiFileCopyLine size={16} className="mr-2" />
									{this.state.copyFeedback ? "Report Copied" : "Copy Report"}
								</Button>
								<Button
									onClick={this.handleReset}
									className="rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 shadow-none"
								>
									<RiRefreshLine size={16} className="mr-2" />
									Try Again
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										window.location.href = "/";
									}}
									className="rounded-sm font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-6 border border-border shadow-none ml-auto"
								>
									<RiHomeLine size={16} className="mr-2" />
									Go to Home
								</Button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
