import { RiAlertLine, RiCheckboxCircleLine } from "@remixicon/react";
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

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: "delete" | "suspend" | "confirm";
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function ConfirmationModal({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	type = "confirm",
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmationModalProps) {
	const isDanger = type === "delete" || type === "suspend";
	const Icon = isDanger ? RiAlertLine : RiCheckboxCircleLine;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia
						className={isDanger ? "bg-destructive/10" : "bg-primary/10"}
					>
						<Icon className={isDanger ? "text-destructive" : "text-primary"} />
					</AlertDialogMedia>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel} disabled={isLoading}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						disabled={isLoading}
						variant={isDanger ? "destructive" : "default"}
					>
						{isLoading ? "Processing..." : confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
