import { RiArrowRightLine, RiCloseLine, RiMenuLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/shared/constants/routes";
import { useScroll } from "@/shared/hooks/use-scroll";
import type { RootState } from "@/store";
import { HeaderLogo } from "./header/header-logo";
import { HeaderUserNav } from "./header/header-user-nav";

const navLinks = [
	{ label: "Products", href: ROUTES.PUBLIC.PRODUCTS },
	{ label: "Services", href: ROUTES.PUBLIC.SERVICES },
	{ label: "Auctions", href: ROUTES.PUBLIC.AUCTIONS },
	{ label: "Suppliers", href: ROUTES.PUBLIC.SUPPLIERS },
];

const secondaryLinks = [
	{ label: "About Us", href: ROUTES.ABOUT },
	{ label: "Help Center", href: ROUTES.HELP },
	{ label: "Become a Supplier", href: ROUTES.AUTH.SIGNUP },
];

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const mobileMenuId = React.useId();

	return (
		<div className="md:hidden">
			<Button
				aria-controls={mobileMenuId}
				aria-expanded={open}
				aria-label="Toggle menu"
				className="h-7 w-7 p-0 hover:bg-transparent"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="ghost"
			>
				{open ? (
					<RiCloseLine className="size-3.5" />
				) : (
					<RiMenuLine className="size-3.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id={mobileMenuId}>
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-6 bg-background border-t border-border/40 flex flex-col",
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex flex-col gap-2">
							<span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
								Navigation
							</span>
							{navLinks.map((link) => (
								<Link
									className="flex items-center justify-between text-base font-black uppercase tracking-[0.15em] py-3 border-b border-border/5 group"
									key={link.label}
									to={link.href}
									onClick={() => setOpen(false)}
								>
									{link.label}
									<RiArrowRightLine className="size-4 opacity-30 group-hover:opacity-100 transition-all" />
								</Link>
							))}
						</div>

						<div className="mt-8 flex flex-col gap-2">
							<span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
								Resources
							</span>
							{secondaryLinks.map((link) => (
								<Link
									className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors py-2"
									key={link.label}
									to={link.href}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Link>
							))}
						</div>

						{!isAuthenticated && (
							<div className="mt-auto pt-8 flex flex-col gap-3">
								<Link to={ROUTES.AUTH.SIGNIN} onClick={() => setOpen(false)}>
									<Button
										className="w-full h-12 text-xs font-black uppercase tracking-widest rounded-none"
										variant="outline"
									>
										Sign In
									</Button>
								</Link>
								<Link to={ROUTES.AUTH.SIGNUP} onClick={() => setOpen(false)}>
									<Button className="w-full h-12 text-xs font-black uppercase tracking-widest rounded-none">
										Get Started
									</Button>
								</Link>
							</div>
						)}
					</div>
				</Portal>
			)}
		</div>
	);
}

export const Header: React.FC = () => {
	const scrolled = useScroll(10);
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-transparent border-b transition-all duration-300",
				{
					"border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/50":
						scrolled,
				},
			)}
		>
			<div className="mx-auto flex h-14 w-full max-w-[1800px] items-center justify-between px-3 sm:px-6 lg:px-8 gap-1 sm:gap-4 overflow-hidden">
				<HeaderLogo />

				{/* Main Navigation - Visible on all screens, scrollable on mobile */}
				<nav className="flex-1 flex items-center relative overflow-hidden mx-0.5 sm:mx-6">
					<div className="flex-1 flex items-center overflow-x-auto scrollbar-hide no-scrollbar border-x border-border/5 sm:border-none">
						<div className="flex items-center gap-0 px-0.5 sm:gap-0.5">
							{navLinks.map((link) => (
								<Link
									key={link.label}
									to={link.href}
									className="font-heading font-black text-[9px] sm:text-[10px] tracking-[0.05em] sm:tracking-[0.15em] text-foreground/80 hover:text-primary px-2 sm:px-3 py-1.5 uppercase transition-all relative group shrink-0"
									activeProps={{
										className: "text-primary",
									}}
								>
									{link.label}
									<span className="absolute bottom-1 left-2 right-2 sm:left-3 sm:right-3 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 group-[.active]:scale-x-100 transition-transform duration-300" />
								</Link>
							))}
						</div>
					</div>
					{/* Swipe Indicator Gradient */}
					<div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
				</nav>

				<div className="flex items-center gap-0.5 sm:gap-3 shrink-0">
					<div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border/40">
						{!isAuthenticated ? (
							<>
								<Link to={ROUTES.AUTH.SIGNIN}>
									<Button
										size="sm"
										variant="ghost"
										className="font-heading font-black uppercase tracking-[0.2em] hover:text-primary hover:bg-primary/5 text-[9px] px-4 rounded-none h-9 transition-all"
									>
										Sign In
									</Button>
								</Link>
								<Link to={ROUTES.AUTH.SIGNUP}>
									<Button
										size="sm"
										className="font-heading font-black text-[9px] uppercase tracking-[0.2em] px-6 bg-primary text-white hover:bg-primary/90 rounded-none h-9 shadow-sm shadow-primary/20 transition-all"
									>
										Get Started
									</Button>
								</Link>
							</>
						) : (
							<HeaderUserNav isAuthenticated={isAuthenticated} user={user} />
						)}
					</div>

					{/* Mobile View - Actions and Menu */}
					<div className="flex items-center gap-0 sm:hidden">
						{isAuthenticated && (
							<HeaderUserNav isAuthenticated={isAuthenticated} user={user} />
						)}
						<MobileNav />
					</div>
				</div>
			</div>
		</header>
	);
};
