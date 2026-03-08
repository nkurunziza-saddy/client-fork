import {
	RiBuilding2Line,
	RiGlobeLine,
	RiPagesLine,
	RiUserLine,
} from "@remixicon/react";
import type React from "react";

import { useGetMarketplaceStatsQuery } from "@/services/api/stats";

export const MarketplaceStats: React.FC = () => {
	const { data: stats } = useGetMarketplaceStatsQuery();

	function formatNumber(val: any, appendPlus = true): string {
		const num = Number(val);
		if (val === undefined || Number.isNaN(num)) return "...";
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k${appendPlus ? "+" : ""}`;
		}
		return `${num}${appendPlus ? "+" : ""}`;
	}

	const STATS = [
		{
			icon: <RiBuilding2Line className="w-8 h-8" />,
			value: formatNumber(stats?.verifiedSuppliers),
			label: "Verified Suppliers",
			description: "Industry leaders and manufacturers",
		},
		{
			icon: <RiPagesLine className="w-8 h-8" />,
			value: formatNumber(stats?.productsListed),
			label: "Products Listed",
			description: "Materials, tools, and heavy machinery",
		},
		{
			icon: <RiUserLine className="w-8 h-8" />,
			value: formatNumber(stats?.activeContractors),
			label: "Active Contractors",
			description: "Professional builders using the platform",
		},
		{
			icon: <RiGlobeLine className="w-8 h-8" />,
			value: stats?.districtsCovered ? String(stats.districtsCovered) : "...",
			label: "Districts Covered",
			description: "Full service coverage across Rwanda",
		},
	];
	return (
		<section className="py-24 bg-slate-950 text-white relative overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute inset-0 opacity-10 pointer-events-none">
				<div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
				<div className="absolute bottom-0 left-0 w-1/2 h-full bg-sky-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
			</div>

			<div className="max-w-[1600px] mx-auto px-4 lg:px-6 relative z-10">
				<div className="text-center max-w-3xl mx-auto mb-20">
					<h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
						The Platform for{" "}
						<span className="text-primary">Rwanda's Construction</span>
					</h2>
					<p className="text-lg text-white/60 leading-relaxed font-normal">
						AfrikaMarket connects the entire construction industry, from local
						manufacturers to large-scale infrastructure projects.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{STATS.map((stat, index) => (
						<div
							key={index}
							className="p-10 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 group text-center"
						>
							<div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/5">
								{stat.icon}
							</div>
							<div className="text-5xl font-sans font-bold text-white mb-3">
								{stat.value}
							</div>
							<div className="text-lg font-heading font-bold text-white/90 mb-2">
								{stat.label}
							</div>
							<div className="text-sm text-white/40 font-normal">
								{stat.description}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
