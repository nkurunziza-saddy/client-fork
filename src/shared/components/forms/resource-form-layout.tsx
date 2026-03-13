import type * as React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResourceFormLayoutProps {
	children: React.ReactNode;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
	canSubmit?: boolean;
	isSubmitting?: boolean;
	isLoading?: boolean;
	serverError?: string;
	submitLabel?: string;
	submittingLabel?: string;
	className?: string;
}

export function ResourceFormLayout({
	children,
	onSubmit,
	onCancel,
	canSubmit = true,
	isSubmitting = false,
	isLoading = false,
	serverError,
	submitLabel = "Save Changes",
	submittingLabel = "Saving...",
	className,
}: ResourceFormLayoutProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onSubmit(e);
			}}
			className={cn("space-y-6", className)}
		>
			{serverError && (
				<Alert
					variant="destructive"
					className="rounded-none border-destructive/20 bg-destructive/5"
				>
					<AlertDescription className="font-bold uppercase tracking-widest text-[10px]">
						{serverError}
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-5">{children}</div>

			<div className="flex gap-3 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex-1 rounded-none border border-border/40 h-11 font-heading font-black uppercase text-[10px] tracking-[0.2em]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={!canSubmit || isLoading || isSubmitting}
					className="flex-1 rounded-none h-11 font-heading font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20"
				>
					{isSubmitting || isLoading ? submittingLabel : submitLabel}
				</Button>
			</div>
		</form>
	);
}
