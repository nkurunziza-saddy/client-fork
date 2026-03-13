import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "../image-with-fallback";

export interface ResourceCardProps {
	id: string;
	name: string;
	image?: string | null;
	categoryName?: string;
	viewMode?: "grid" | "list";
	onClick?: () => void;
	onMouseEnter?: () => void;
	isInWishlist?: boolean;
	onToggleWishlist?: (e: React.MouseEvent) => void;
	children: React.ReactNode;
	badges?: React.ReactNode;
	topRight?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
	imageClassName?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
	name,
	image,
	categoryName,
	viewMode = "grid",
	onClick,
	onMouseEnter,
	isInWishlist,
	onToggleWishlist,
	children,
	badges,
	topRight,
	footer,
	className,
	imageClassName,
}) => {
	const wishlistButton = onToggleWishlist && (
		<Button
			data-testid="wishlist-button"
			variant={viewMode === "grid" ? "outline" : "ghost"}
			size="icon"
			className={cn(
				viewMode === "grid"
					? "absolute top-1.5 right-1.5 shadow-2xl bg-background/80 md:backdrop-blur-md border-border/20 rounded-none w-7 h-7 sm:w-8 sm:h-8 z-10"
					: "",
				viewMode === "grid" &&
					!isInWishlist &&
					"opacity-0 group-hover:opacity-100 transition-opacity",
			)}
			onClick={(e) => {
				e.stopPropagation();
				onToggleWishlist(e);
			}}
		>
			{isInWishlist ? (
				<RiHeartFill className="fill-destructive text-destructive w-3.5 h-3.5 sm:w-4 sm:h-4" />
			) : (
				<RiHeartLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
			)}
		</Button>
	);

	if (viewMode === "list") {
		return (
			<div
				role="button"
				tabIndex={0}
				className={cn(
					"group flex gap-5 bg-card border border-border/20 hover:border-primary/30 rounded-none p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden",
					className,
				)}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
			>
				<div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />

				<div
					className={cn(
						"relative w-52 aspect-video shrink-0 overflow-hidden rounded-none bg-muted/30 border border-border/10",
						imageClassName,
					)}
				>
					<ImageWithFallback
						src={image || undefined}
						alt={name}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</div>

				<div className="flex flex-col grow py-1">
					<div className="flex justify-between items-start">
						<div>
							{categoryName && (
								<div className="text-[10px] font-bold text-primary/70 mb-1.5 uppercase tracking-[0.3em] font-display">
									{categoryName}
								</div>
							)}
							<h3 className="text-lg font-display font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight uppercase tracking-tight">
								{name}
							</h3>
						</div>
						{wishlistButton}
					</div>

					<div className="flex-1">{children}</div>
					{footer && <div className="mt-auto">{footer}</div>}
				</div>
			</div>
		);
	}

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"group flex flex-col bg-card border border-border/20 hover:border-primary/40 transition-all duration-500 cursor-pointer h-full relative rounded-none overflow-hidden hover:shadow-lg hover:shadow-primary/5",
				className,
			)}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
		>
			<div className="absolute top-0 left-0 w-full h-px transition-all duration-500 z-20 bg-primary/0 group-hover:bg-primary/40" />

			<div
				className={cn(
					"relative aspect-[4/3] sm:aspect-4/3 overflow-hidden bg-muted/10",
					imageClassName,
				)}
			>
				<ImageWithFallback
					src={image || undefined}
					alt={name}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>

				{badges && (
					<div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10 scale-90 origin-top-left">
						{badges}
					</div>
				)}

				{topRight && (
					<div className="absolute top-1.5 right-1.5 z-10 scale-90 origin-top-right">
						{topRight}
					</div>
				)}

				{!topRight && wishlistButton}
			</div>

			<div className="p-2 sm:p-4 flex flex-col grow gap-1.5 sm:gap-2">
				<div className="flex items-center justify-between gap-2">
					{categoryName && (
						<div className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-1.5 py-0.5 w-fit">
							{categoryName}
						</div>
					)}
					{topRight && wishlistButton && (
						<div className="scale-75 -mr-2">{wishlistButton}</div>
					)}
				</div>
				<h3 className="text-[11px] sm:text-xs md:text-[13px] font-display font-extrabold text-foreground tracking-tight leading-tight line-clamp-2 min-h-[1.75rem] sm:min-h-10 group-hover:text-primary transition-colors uppercase">
					{name}
				</h3>

				<div className="flex-1">{children}</div>
				{footer && (
					<div className="mt-auto pt-2 sm:pt-3 border-t border-border/40">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};
