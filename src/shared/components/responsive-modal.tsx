import { RiCloseLine } from "@remixicon/react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface ResponsiveModalProps {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	trigger?: React.ReactElement;
	className?: string;
	showCloseButton?: boolean;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveModal({
	children,
	open,
	onOpenChange,
	title,
	description,
	trigger,
	className,
	showCloseButton = true,
	footer,
	size = "sm",
}: ResponsiveModalProps) {
	const isMobile = useIsMobile();
	const dialogSizeClass = {
		sm: "sm:max-w-[425px]",
		md: "sm:max-w-[520px]",
		lg: "sm:max-w-[640px]",
		xl: "sm:max-w-[720px]",
	}[size];

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
				<DrawerContent className={cn("px-4 pb-8 safe-area-bottom", className)}>
					{(title || description || showCloseButton) && (
						<DrawerHeader className="text-left px-0 mb-4">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-2">
									{title && (
										<DrawerTitle className="font-display font-black uppercase text-xl tracking-tighter">
											{title}
										</DrawerTitle>
									)}
									{description && (
										<DrawerDescription className="text-xs uppercase font-bold tracking-widest opacity-60">
											{description}
										</DrawerDescription>
									)}
								</div>
								{showCloseButton && (
									<DrawerClose asChild>
										<Button variant="ghost" size="icon-sm" className="mt-1">
											<RiCloseLine />
											<span className="sr-only">Close</span>
										</Button>
									</DrawerClose>
								)}
							</div>
						</DrawerHeader>
					)}
					{children}
					{footer && (
						<div className="mt-6 border-t border-border/30 pt-4">{footer}</div>
					)}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent
				className={cn(
					"rounded-none border-border industrial-grain",
					dialogSizeClass,
					className,
				)}
				showCloseButton={showCloseButton}
			>
				{(title || description) && (
					<DialogHeader className="space-y-4 mb-4">
						{title && (
							<DialogTitle className="font-display font-black uppercase text-2xl tracking-tighter">
								{title}
							</DialogTitle>
						)}
						{description && (
							<DialogDescription className="text-xs uppercase font-bold tracking-widest opacity-60">
								{description}
							</DialogDescription>
						)}
					</DialogHeader>
				)}
				{children}
				{footer && (
					<div className="mt-6 border-t border-border/30 pt-4">{footer}</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
