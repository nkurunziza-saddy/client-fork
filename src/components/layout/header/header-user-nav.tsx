import {
	RiArrowDownSLine,
	RiChat1Line,
	RiDashboardLine,
	RiHeartLine,
	RiLogoutBoxRLine,
	RiUserLine,
} from "@remixicon/react";
import { Link, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOutMutation } from "@/services/api/auth";
import { useGetWishlistQuery } from "@/services/api/wishlist";
import { ROLES } from "@/shared/constants";
import { ROUTES } from "@/shared/constants/routes";
import { logout } from "@/store/slices/auth-slice";

import type { AuthUser } from "@/types";

const PROVIDER_ROLES = [ROLES.PROVIDER, ROLES.ADMIN, ROLES.AGENT] as string[];

interface HeaderUserNavProps {
	isAuthenticated: boolean;
	user: AuthUser | null;
}

export const HeaderUserNav: React.FC<HeaderUserNavProps> = ({
	isAuthenticated,
	user,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [signOut] = useSignOutMutation();
	const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

	const handleLogout = async () => {
		try {
			await signOut().unwrap();
		} catch {}
		dispatch(logout());
		navigate({ to: ROUTES.HOME });
	};
	return (
		<div className="flex items-center gap-2 md:gap-4">
			{isAuthenticated && (
				<div className="hidden md:flex items-center gap-1.5 px-1.5 border-l border-r border-border/40">
					<Button
						variant="ghost"
						size="icon"
						className="relative h-9 w-9 text-muted-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
						onClick={() => navigate({ to: ROUTES.PROTECTED.WISHLIST })}
					>
						<RiHeartLine size={18} />
						{wishlistCount > 0 && (
							<Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[9px] font-bold bg-primary text-primary-foreground border-2 border-background rounded-md font-sans">
								{wishlistCount > 99 ? "99+" : wishlistCount}
							</Badge>
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 text-muted-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
						onClick={() => navigate({ to: ROUTES.PROTECTED.MESSAGES })}
					>
						<RiChat1Line size={18} />
					</Button>
				</div>
			)}

			{isAuthenticated && user ? (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								className="flex items-center gap-1.5 pl-0.5 pr-1 py-0.5 h-8 rounded-none border border-border/40 hover:border-primary/30 hover:bg-muted/5 transition-all duration-300"
							>
								<Avatar className="h-6.5 w-6.5 rounded-none border border-border/40">
									<AvatarImage src={user.image} alt={user.name} />
									<AvatarFallback className="font-heading font-bold bg-primary/5 text-primary text-[8px] rounded-none">
										{user.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<RiArrowDownSLine
									size={12}
									className="text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-300"
								/>
							</Button>
						}
					/>
					<DropdownMenuContent
						className="w-72 align-end border border-border/40 rounded-lg shadow-[0_20px_50px] shadow-foreground/10 p-1.5 bg-background/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300"
						align="end"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="font-normal p-0 overflow-hidden rounded-md mb-1">
								<div className="relative p-4 bg-muted/10 border-b border-border/40 overflow-hidden">
									<div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none" />
									<div className="relative z-10 flex flex-col space-y-1.5 leading-none">
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-primary" />
												<p className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
													{user.name}
												</p>
											</div>
											{user.role && (
												<span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
													{user.role}
												</span>
											)}
										</div>
										{user.email && (
											<p className="text-[11px] leading-none text-muted-foreground/80 font-medium truncate max-w-[200px] font-sans ml-3.5">
												{user.email}
											</p>
										)}
									</div>
								</div>
							</DropdownMenuLabel>
							{(user.role === ROLES.ADMIN || user.role === ROLES.AGENT) && (
								<DropdownMenuItem
									onClick={() => navigate({ to: ROUTES.ADMIN.INDEX })}
									className="cursor-pointer rounded-md focus:bg-primary/5 focus:text-primary py-2.5 transition-colors"
								>
									<RiDashboardLine size={16} className="mr-3 opacity-70" />
									<span className="font-bold uppercase text-[10px] tracking-[0.15em]">
										Admin Panel
									</span>
								</DropdownMenuItem>
							)}
							{PROVIDER_ROLES.includes(user.role) && (
								<DropdownMenuItem
									onClick={() => navigate({ to: ROUTES.DASHBOARD.INDEX })}
									className="cursor-pointer rounded-md focus:bg-primary/5 focus:text-primary py-2.5 transition-colors"
								>
									<RiDashboardLine size={16} className="mr-3 opacity-70" />
									<span className="font-bold uppercase text-[10px] tracking-[0.15em]">
										Supplier Dashboard
									</span>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onClick={() => navigate({ to: ROUTES.PROTECTED.PROFILE })}
								className="cursor-pointer rounded-md focus:bg-primary/5 focus:text-primary py-2.5 transition-colors"
							>
								<RiUserLine size={16} className="mr-3 opacity-70" />
								<span className="font-bold uppercase text-[10px] tracking-[0.15em]">
									My Profile
								</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-border/40 my-1.5" />
							<DropdownMenuItem
								onClick={handleLogout}
								className="cursor-pointer rounded-md focus:bg-destructive/5 focus:text-destructive py-2.5 text-destructive transition-colors"
							>
								<RiLogoutBoxRLine size={16} className="mr-3" />
								<span className="font-bold uppercase text-[10px] tracking-[0.15em]">
									Sign Out
								</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className="hidden md:flex items-center gap-3">
					<Link to={ROUTES.AUTH.SIGNIN}>
						<Button
							variant="ghost"
							className="font-heading font-bold uppercase tracking-[0.15em] hover:text-primary hover:bg-primary/5 text-[11px] h-10 px-5 rounded-lg transition-all"
						>
							Sign In
						</Button>
					</Link>
					<Link to={ROUTES.AUTH.SIGNUP}>
						<Button className="font-heading font-bold text-[11px] uppercase tracking-[0.15em] h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
							Join Free
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
};
