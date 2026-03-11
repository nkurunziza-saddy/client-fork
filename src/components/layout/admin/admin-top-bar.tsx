import {
	RiDashboardLine,
	RiFlashlightLine,
	RiNotification3Line,
	RiSearchLine,
	RiShoppingCartLine,
	RiUserLine,
} from "@remixicon/react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Package } from "lucide-react";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ROUTES } from "@/shared/constants/routes";
import type { AuthUser } from "@/types";

interface AdminTopBarProps {
	user: AuthUser | null;
}

const menuItems = [
	{ label: "Dashboard", path: ROUTES.ADMIN.INDEX, icon: RiDashboardLine },
	{ label: "Suppliers", path: ROUTES.ADMIN.SUPPLIERS.INDEX, icon: RiUserLine },
	{
		label: "Customers",
		path: ROUTES.ADMIN.BUYERS,
		icon: RiShoppingCartLine,
	},
	{ label: "Categories", path: ROUTES.ADMIN.CATEGORIES, icon: Package },
	{ label: "Services", path: ROUTES.ADMIN.SERVICES, icon: RiFlashlightLine },
	{ label: "Products", path: ROUTES.ADMIN.PRODUCTS, icon: Package },
];

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ user }) => {
	const routerState = useRouterState();
	const pathname = routerState.location.pathname;
	const navigate = useNavigate();
	const isActive = (path: string) => pathname === path;

	const currentLabel =
		menuItems.find((item) => isActive(item.path))?.label || "Admin";

	return (
		<header className="h-20 border-b border-border flex items-center px-8 bg-background/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
			<div className="flex items-center gap-4 flex-1">
				<SidebarTrigger className="border border-border rounded-sm hover:border-primary transition-colors h-10 w-10" />
				<Separator orientation="vertical" className="h-8 bg-border w-[2px]" />
				<div className="hidden md:flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">
					<button
						type="button"
						className="hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 font-heading font-bold uppercase tracking-[0.2em] outline-none focus-visible:text-primary"
						onClick={() => navigate({ to: ROUTES.ADMIN.INDEX })}
					>
						Root
					</button>
					<span>/</span>
					<span className="text-primary">{currentLabel}</span>
				</div>
			</div>

			<div className="flex items-center gap-4">
				{/* Search Shortcut */}
				<div className="hidden lg:flex items-center gap-3 px-4 h-10 bg-muted/50 border border-border rounded-sm text-muted-foreground transition-all hover:border-primary/50 group w-64">
					<RiSearchLine
						size={16}
						className="group-hover:text-primary transition-colors"
					/>
					<span className="text-[10px] font-heading font-bold uppercase tracking-widest flex-1">
						Search
					</span>
					<Badge
						variant="outline"
						className="h-5 px-1.5 font-mono text-[9px] border-border bg-background"
					>
						CMD+K
					</Badge>
				</div>

				{/* Notifications */}
				<Button
					variant="outline"
					size="icon"
					className="h-10 w-10 border border-border rounded-sm relative hover:border-primary transition-all group shadow-none"
				>
					<RiNotification3Line
						size={18}
						className="text-muted-foreground group-hover:text-primary transition-colors"
					/>
					<span className="absolute top-[-2px] right-[-2px] w-3 h-3 bg-primary border border-background rounded-full"></span>
				</Button>

				<Separator orientation="vertical" className="h-8 bg-border w-[2px]" />

				<div className="flex items-center gap-3 pl-2">
					<div className="hidden sm:flex flex-col text-right">
						<span className="text-[10px] font-heading font-bold text-foreground uppercase tracking-widest">
							{user?.name || "Admin"}
						</span>
						<span className="text-[8px] font-mono text-primary font-black uppercase tracking-tighter italic">
							Verified
						</span>
					</div>
					<Avatar className="h-10 w-10 rounded-sm border border-border shadow-none">
						<AvatarImage src={user?.avatar} />
						<AvatarFallback className="bg-foreground text-background font-heading font-bold text-xs uppercase">
							{user?.name?.charAt(0) || "A"}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</header>
	);
};
