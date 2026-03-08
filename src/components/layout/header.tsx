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
	{ label: "About", href: ROUTES.ABOUT },
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
				className="md:hidden h-10 w-10 p-0"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="ghost"
			>
				{open ? (
					<RiCloseLine className="size-5" />
				) : (
					<RiMenuLine className="size-5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id={mobileMenuId}>
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4 bg-background border-t border-border/40",
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-4 pt-4">
							{navLinks.map((link) => (
								<Link
									className="flex items-center justify-between text-lg font-black uppercase tracking-[0.2em] px-4 py-3 hover:bg-muted transition-colors group"
									key={link.label}
									to={link.href}
									onClick={() => setOpen(false)}
									activeProps={{
										className:
											"text-primary bg-primary/5 border-l-4 border-primary",
									}}
								>
									{link.label}
									<RiArrowRightLine className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
								</Link>
							))}
						</div>
						{!isAuthenticated && (
							<div className="mt-8 flex flex-col gap-3">
								<Link to={ROUTES.AUTH.SIGNIN} onClick={() => setOpen(false)}>
									<Button
										className="w-full h-11 text-base font-bold"
										variant="outline"
									>
										Sign In
									</Button>
								</Link>
								<Link to={ROUTES.AUTH.SIGNUP} onClick={() => setOpen(false)}>
									<Button className="w-full h-11 text-base font-bold">
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
			<div className="mx-auto flex h-12 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
				<HeaderLogo />

				<div className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.href}
							className="font-heading font-black text-[10px] tracking-[0.2em] text-foreground/80 hover:text-primary px-4 py-2 uppercase transition-all relative group"
							activeProps={{
								className: "text-primary",
							}}
						>
							{link.label}
							<span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 group-[.active]:scale-x-100 transition-transform duration-300" />
						</Link>
					))}

					<div className="ml-2 pl-2 border-l border-border/40 flex items-center gap-2">
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
				</div>

				{/* Mobile View - Logo and Menu mapped differently */}
				<div className="flex md:hidden items-center gap-2">
					{isAuthenticated && (
						<HeaderUserNav isAuthenticated={isAuthenticated} user={user} />
					)}
					<MobileNav />
				</div>
			</div>
		</header>
	);
};
