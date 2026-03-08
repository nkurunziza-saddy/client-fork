import {
	RiBroadcastLine,
	RiPulseLine,
	RiShieldFlashLine,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";

const LIVE_NETWORK_FEED = [
	{
		id: 1,
		company: "KGL_Logistics",
		action: "added",
		detail: "New Bulk Cement Inventory (5000+ Units)",
		time: "1m ago",
	},
	{
		id: 2,
		company: "Eng_Mutesa",
		action: "connected with",
		detail: "Heavy Machinery Provider [Gasabo]",
		time: "4m ago",
	},
	{
		id: 3,
		company: "BuildRwanda_Corp",
		action: "posted",
		detail: "RFQ: Reinforcement Steel (12mm)",
		time: "Just now",
	},
	{
		id: 4,
		company: "Infra_Systems",
		action: "secured",
		detail: "Logistics Contract for Regional Transit",
		time: "10m ago",
	},
	{
		id: 5,
		company: "System_Core",
		action: "verified",
		detail: "3 New Suppliers Added",
		time: "Live",
	},
];

export const LiveDealsTicker: React.FC = () => {
	const navigate = useNavigate();
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % LIVE_NETWORK_FEED.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const feed = LIVE_NETWORK_FEED[currentIndex];

	return (
		<div className="w-full bg-primary border-b border-primary/20 py-1.5 md:py-2.5 overflow-hidden shadow-lg shadow-primary/10">
			<div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 md:gap-4 overflow-hidden">
					<div className="flex items-center gap-1.5 md:gap-2 text-white shrink-0">
						<RiBroadcastLine
							size={12}
							className="md:size-[14px] animate-pulse"
						/>
						<span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] font-heading whitespace-nowrap">
							<span className="sm:hidden">LIVE</span>
							<span className="hidden sm:inline">Recent Activity</span>
						</span>
					</div>

					<div className="h-3 md:h-4 w-[1px] bg-white/20 shrink-0" />

					<div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] text-white/90 font-sans tracking-tight overflow-hidden">
						<span className="font-black uppercase text-[9px] md:text-[10px] shrink-0 truncate max-w-[60px] sm:max-w-none">
							{feed.company}
						</span>
						<span className="text-white/60 lowercase italic font-medium shrink-0 hidden xs:inline">
							{feed.action}
						</span>
						<span
							className="font-bold hover:underline cursor-pointer truncate"
							onClick={() => navigate({ to: "/products" as any })}
						>
							<span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-none inline-block align-bottom uppercase">
								{feed.detail}
							</span>
						</span>
						<span className="hidden sm:inline text-[9px] text-white/40 ml-2 font-mono font-bold">
							[{feed.time}]
						</span>
					</div>
				</div>

				<div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/70 shrink-0">
					<div className="flex items-center gap-2">
						<RiShieldFlashLine size={14} className="text-white" />
						<span>Suppliers Online</span>
					</div>
					<div className="flex items-center gap-2">
						<RiPulseLine size={14} className="text-white" />
						<span>Secure Transactions</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LiveDealsTicker;
