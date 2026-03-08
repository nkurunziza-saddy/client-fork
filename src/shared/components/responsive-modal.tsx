import type * as React from "react";
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
}

export function ResponsiveModal({
	children,
	open,
	onOpenChange,
	title,
	description,
	trigger,
	className,
}: ResponsiveModalProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
				<DrawerContent className={cn("px-4 pb-8", className)}>
					{(title || description) && (
						<DrawerHeader className="text-left px-0 mb-4">
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
						</DrawerHeader>
					)}
					{children}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent
				className={cn(
					"sm:max-w-[425px] rounded-none border-border industrial-grain",
					className,
				)}
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
			</DialogContent>
		</Dialog>
	);
}
