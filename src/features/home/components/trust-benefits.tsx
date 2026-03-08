import {
	RiCheckboxCircleLine,
	RiCustomerService2Line,
	RiShieldCheckLine,
	RiTruckLine,
} from "@remixicon/react";
import type React from "react";

const BENEFITS = [
	{
		icon: <RiShieldCheckLine className="w-6 h-6" />,
		title: "Verified Quality",
		description:
			"Every supplier and product undergoes a rigorous verification process.",
	},
	{
		icon: <RiCheckboxCircleLine className="w-6 h-6" />,
		title: "Secure Transactions",
		description: "Safe and secure payments for all your bulk orders.",
	},
	{
		icon: <RiTruckLine className="w-6 h-6" />,
		title: "Reliable Logistics",
		description:
			"Coordinated delivery tracking across all 30 districts of Rwanda.",
	},
	{
		icon: <RiCustomerService2Line className="w-6 h-6" />,
		title: "Expert Support",
		description:
			"Dedicated account managers for large-scale construction projects.",
	},
];

export const TrustBenefits: React.FC = () => {
	return (
		<section className="py-12 bg-background border-b border-border/40">
			<div className="max-w-[1600px] mx-auto px-4 lg:px-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
					{BENEFITS.map((benefit) => (
						<div key={benefit.title} className="flex items-start gap-5 group">
							<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
								{benefit.icon}
							</div>
							<div>
								<h3 className="text-lg font-heading font-bold text-foreground mb-1 tracking-tight">
									{benefit.title}
								</h3>
								<p className="text-sm text-muted-foreground/80 leading-relaxed font-sans">
									{benefit.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
