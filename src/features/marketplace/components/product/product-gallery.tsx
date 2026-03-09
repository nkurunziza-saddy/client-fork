import type React from "react";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/shared/components/image-with-fallback";

interface ProductGalleryProps {
	name: string;
	images: string[];
	selectedImageIndex: number;
	onImageSelect: (index: number) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
	name,
	images,
	selectedImageIndex,
	onImageSelect,
}) => {
	return (
		<div className="md:col-span-7 space-y-4">
			<div className="aspect-4/5 overflow-hidden rounded-none border border-border bg-muted/5 relative group">
				<div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
				{images[selectedImageIndex] ? (
					<ImageWithFallback
						src={images[selectedImageIndex]}
						alt={name}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
						Image not available
					</div>
				)}
				<div className="absolute bottom-6 right-6">
					<Badge className="bg-background/80 backdrop-blur-md text-foreground border border-border rounded-none text-[9px] font-black tracking-widest uppercase">
						{selectedImageIndex + 1} / {images.length || 1}
					</Badge>
				</div>
			</div>

			{images.length > 1 && (
				<div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
					{images.map((image, idx) => (
						<button
							type="button"
							key={image}
							onClick={() => onImageSelect(idx)}
							className={`w-20 aspect-square shrink-0 overflow-hidden rounded-none border transition-all duration-300 ${
								selectedImageIndex === idx
									? "border-primary opacity-100 scale-105"
									: "border-border opacity-40 hover:opacity-100"
							}`}
						>
							<ImageWithFallback
								src={image}
								alt=""
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
