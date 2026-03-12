import { Star, Target } from "lucide-react";
import type React from "react";

export const PerformanceSummaryCard: React.FC = () => {
	return (
		<div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
				<div className="flex-1">
					<div className="flex items-center mb-4">
						<div className="p-3 bg-background/20 rounded-xl mr-4">
							<Target className="w-8 h-8" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">Performance Summary</h3>
							<p className="opacity-90">
								Your business is performing excellently this month!
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold mb-1">94.2%</div>
							<div className="text-sm opacity-90">Response Rate</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold mb-1">8.7%</div>
							<div className="text-sm opacity-90">Conversion Rate</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold mb-1">4.8/5</div>
							<div className="text-sm opacity-90">Avg. Rating</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold mb-1">+23.5%</div>
							<div className="text-sm opacity-90">Growth Rate</div>
						</div>
					</div>
				</div>

				<div className="flex-shrink-0">
					<div className="bg-background/20 rounded-2xl p-6 text-center">
						<Star className="w-12 h-12 mx-auto mb-3" />
						<div className="text-lg font-bold">Top Performer</div>
						<div className="text-sm opacity-90">Electronics Category</div>
					</div>
				</div>
			</div>
		</div>
	);
};
