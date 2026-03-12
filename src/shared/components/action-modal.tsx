import type { ReactNode } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ActionModalProps {
	isOpen: boolean;
	type: "delete" | "suspend" | "warning" | "success" | "info";
	title: string;
	description?: string;
	message?: string;
	icon?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	confirmValue?: string;
	inputValue?: string;
	inputPlaceholder?: string;
	inputLabel?: string;
	onInputChange?: (value: string) => void;
	onConfirm?: () => void;
	onCancel: () => void;
	isLoading?: boolean;
	isDisabled?: boolean;
	children?: ReactNode;
	showFooter?: boolean;
}

export function ActionModal({
	isOpen,
	type,
	title,
	description,
	message,
	icon,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmValue,
	inputValue,
	inputPlaceholder,
	inputLabel,
	onInputChange,
	onConfirm = () => {},
	onCancel,
	isLoading = false,
	isDisabled = false,
	children,
	showFooter = true,
}: ActionModalProps) {
	const colorConfig = {
		delete: {
			media: "bg-destructive/10",
			iconColor: "text-destructive",
			variant: "destructive" as const,
			warning: "bg-destructive/5 border-destructive/20 text-destructive",
		},
		suspend: {
			media: "bg-warning/10",
			iconColor: "text-warning",
			variant: "default" as const,
			warning: "bg-warning/5 border-warning/20 text-warning",
		},
		warning: {
			media: "bg-primary/10",
			iconColor: "text-primary",
			variant: "default" as const,
			warning: "bg-primary/5 border-primary/20 text-primary",
		},
		success: {
			media: "bg-success/10",
			iconColor: "text-success",
			variant: "default" as const,
			warning: "bg-success/5 border-success/20 text-success",
		},
		info: {
			media: "bg-info/10",
			iconColor: "text-info",
			variant: "default" as const,
			warning: "bg-info/5 border-info/20 text-info",
		},
	};

	const config = colorConfig[type];

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					{(icon || config.media) && (
						<AlertDialogMedia className={config.media}>
							<div className={config.iconColor}>{icon}</div>
						</AlertDialogMedia>
					)}
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>

				<div className="space-y-4 py-2">
					{message && (
						<div className={`border rounded-lg p-4 text-sm ${config.warning}`}>
							{message}
						</div>
					)}

					{children}

					{inputLabel && onInputChange && (
						<div className="space-y-2">
							<Label>{inputLabel}</Label>
							<Input
								type="text"
								value={inputValue || ""}
								onChange={(e) => onInputChange(e.target.value)}
								placeholder={inputPlaceholder}
								className="h-11 shadow-none"
							/>
							{confirmValue && (
								<p className="text-xs text-muted-foreground">
									Enter "{confirmValue}" exactly to enable confirm button
								</p>
							)}
						</div>
					)}
				</div>

				{showFooter && (
					<AlertDialogFooter>
						<AlertDialogCancel onClick={onCancel} disabled={isLoading}>
							{cancelText}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								onConfirm();
							}}
							disabled={isDisabled || isLoading}
							variant={config.variant}
						>
							{isLoading ? "Processing..." : confirmText}
						</AlertDialogAction>
					</AlertDialogFooter>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
}
