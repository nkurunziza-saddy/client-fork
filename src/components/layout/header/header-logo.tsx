import { Link } from "@tanstack/react-router";
import type React from "react";

export const HeaderLogo: React.FC = () => (
	<Link to="/" className="flex items-center gap-1.5 md:gap-2 group shrink-0">
		<img
			src="/enhanced_gpt.png"
			alt="AfrikaMarket Logo"
			className="h-42 w-auto object-contain group-hover:opacity-90 transition-opacity"
		/>
	</Link>
);
