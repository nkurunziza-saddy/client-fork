import { Link } from "@tanstack/react-router";
import type React from "react";

export const HeaderLogo: React.FC = () => (
	<Link to="/" className="flex items-center group shrink-0 py-1">
		{/* Compact logo for mobile */}
		<img
			src="/logo.svg"
			alt="AfrikaMarket"
			className="h-4.5 w-auto object-contain sm:hidden group-hover:opacity-90 transition-opacity"
			onError={(e) => {
				e.currentTarget.src = "/image-fallback.svg";
			}}
		/>
		{/* Full logo with name for desktop */}
		<img
			src="/logo_with_name.svg"
			alt="AfrikaMarket"
			className="h-7 md:h-8 w-auto object-contain hidden sm:block group-hover:opacity-90 transition-opacity"
			onError={(e) => {
				e.currentTarget.src = "/image-fallback.svg";
			}}
		/>
	</Link>
);
