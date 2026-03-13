import type React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
	label?: string;
	error?: string | string[];
	isTouched?: boolean;
	children: React.ReactNode;
	className?: string;
	required?: boolean;
	headerActions?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
	label,
	error,
	isTouched = true,
	children,
	className,
	required,
	headerActions,
}) => {
	const errors = isTouched
		? Array.isArray(error)
			? error
			: error
				? [error]
				: []
		: [];

	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<div className="flex items-center justify-between mb-1">
					<Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
						{label}
						{required && <span className="text-destructive">*</span>}
					</Label>
					{headerActions}
				</div>
			)}
			{children}
			{errors.length > 0 && (
				<div className="space-y-1">
					{errors.map((err, i) => (
						<p
							key={`${err}-${i}`}
							className="text-[9px] font-bold text-destructive uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1"
						>
							{err}
						</p>
					))}
				</div>
			)}
		</div>
	);
};
