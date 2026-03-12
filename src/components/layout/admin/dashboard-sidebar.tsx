import {
	type RemixiconComponentType,
	RiChat1Line,
	RiCloseLine,
	RiDashboardLine,
	RiLogoutBoxRLine,
	RiNotification3Line,
	RiSettingsLine,
} from "@remixicon/react";
import {
	type LucideIcon,
	Package,
	Award as RiBadgeLine,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import type { DashboardTab } from "@/types";

interface NavigationItem {
	id: DashboardTab;
	label: string;
	icon: RemixiconComponentType | LucideIcon;
}

const navigationItems: NavigationItem[] = [
	{ id: "overview", label: "Dashboard", icon: RiDashboardLine },
	{ id: "inquiries", label: "Inquiries Queue", icon: RiNotification3Line },
	{ id: "messages", label: "Messages & Quotes", icon: RiChat1Line },
	{ id: "products", label: "My Listings", icon: Package },
	{ id: "analytics", label: "Performance", icon: TrendingUp },
	{ id: "settings", label: "Profile & Verification", icon: RiSettingsLine },
];

interface DashboardSidebarProps {
	activeTab: DashboardTab;
	onTabChange: (tab: DashboardTab) => void;
	onClose: () => void;
	onLogout: () => void;
	supplierData: {
		name?: string;
		avatar?: string;
	} | null;
	isOpen: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
	activeTab,
	onTabChange,
	onClose,
	onLogout,
	supplierData,
	isOpen,
}) => (
	<div
		className={cn(
			"fixed inset-y-0 left-0 z-50 w-72 bg-foreground text-background transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border",
			isOpen ? "translate-x-0" : "-translate-x-full",
		)}
	>
		<div className="h-full flex flex-col p-6">
			<div className="flex items-center justify-between mb-10">
				<div className="flex items-center gap-3">
					<div>
						<h1 className="text-lg font-heading font-bold uppercase tracking-widest leading-none">
							AfrikaMarket
						</h1>
						<p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 leading-none">
							Provider
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="lg:hidden p-2 rounded-sm text-muted-foreground hover:text-background transition-colors"
				>
					<RiCloseLine size={20} />
				</button>
			</div>

			<nav className="flex-1 space-y-2">
				{navigationItems.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => {
							onTabChange(item.id);
							onClose();
						}}
						className={cn(
							"w-full flex items-center px-4 py-3.5 text-xs font-heading font-bold uppercase tracking-widest rounded-sm transition-all border",
							activeTab === item.id
								? "bg-background text-foreground border-background shadow-none"
								: "text-muted-foreground border-transparent hover:bg-background/10 hover:text-background",
						)}
					>
						<item.icon
							size={16}
							className={cn(
								"mr-3",
								activeTab === item.id ? "text-primary" : "opacity-70",
							)}
						/>
						{item.label}
					</button>
				))}
			</nav>

			<div className="pt-6 border-t border-background/10">
				<div className="flex items-center gap-3 px-4 py-3 bg-background/5 rounded-sm border border-background/10 mb-4 overflow-hidden">
					<div className="relative shrink-0">
						<img
							src={supplierData?.avatar || "/logo.svg"}
							className="w-10 h-10 rounded-sm object-cover border border-background/20"
							alt=""
							onError={(e) => {
								e.currentTarget.src = "/image-fallback.svg";
							}}
						/>
						<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border border-foreground"></div>
					</div>
					<div className="flex-1 overflow-hidden min-w-0">
						<p className="text-sm font-bold truncate text-background">
							{supplierData?.name || "Supplier"}
						</p>
						<div className="flex items-center gap-1 text-success text-[10px] font-black uppercase tracking-widest">
							<RiBadgeLine size={12} /> Verified
						</div>
					</div>
				</div>

				<button
					type="button"
					onClick={onLogout}
					className="w-full flex items-center justify-center px-4 py-3 text-xs font-heading font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 rounded-sm transition-colors border border-transparent hover:border-destructive/20"
				>
					<RiLogoutBoxRLine size={16} className="mr-2" />
					Sign Out
				</button>
			</div>
		</div>
	</div>
);
