import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	fallbackSrc?: string;
	/**
	 * Use this to provide a more descriptive alt text if not provided via standard alt prop.
	 * Important for SEO and accessibility.
	 */
	description?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
	src,
	alt,
	description,
	className,
	fallbackSrc = "/image-fallback.svg",
	...props
}) => {
	const [error, setError] = useState(false);

	// Accessibility check in development
	useEffect(() => {
		if (process.env.NODE_ENV === "development" && !alt && !description) {
			console.warn(
				`ImageWithFallback: Missing "alt" or "description" for image: ${src}`,
			);
		}
	}, [alt, description, src]);

	const finalAlt = alt || description || "";

	return (
		<img
			src={error || !src ? fallbackSrc : src}
			alt={finalAlt}
			onError={() => setError(true)}
			className={cn(
				"max-w-full h-auto object-cover", // Ensure responsive defaults
				className,
			)}
			loading="lazy"
			decoding="async"
			{...props}
		/>
	);
};
