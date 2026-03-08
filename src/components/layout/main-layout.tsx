import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Suspense, useCallback } from "react";
import { RouteLoading } from "@/shared/components/route-loading";
import { ROUTES } from "@/shared/constants/routes";
import { Footer } from "./footer";
import { Header } from "./header";

export const MainLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isMessagesPage = location.pathname.includes("/messages");

	const handleAboutClick = useCallback(() => {
		navigate({ to: ROUTES.ABOUT });
	}, [navigate]);

	const handleHelpClick = useCallback(() => {
		navigate({ to: ROUTES.HELP });
	}, [navigate]);

	const handleProductsClick = useCallback(() => {
		navigate({ to: ROUTES.PUBLIC.PRODUCTS });
	}, [navigate]);

	const handleServicesClick = useCallback(() => {
		navigate({ to: ROUTES.PUBLIC.SERVICES });
	}, [navigate]);

	const handleSuppliersClick = useCallback(() => {
		navigate({ to: ROUTES.PUBLIC.SUPPLIERS });
	}, [navigate]);

	const handleDashboardClick = useCallback(() => {
		navigate({ to: ROUTES.DASHBOARD.INDEX });
	}, [navigate]);

	return (
		<div className="min-h-screen flex flex-col bg-background industrial-grain relative">
			<Header />
			<main className="flex-grow">
				<Suspense fallback={<RouteLoading />}>
					<Outlet />
				</Suspense>
			</main>
			{!isMessagesPage && (
				<Footer
					onAboutClick={handleAboutClick}
					onHelpClick={handleHelpClick}
					onProductsClick={handleProductsClick}
					onServicesClick={handleServicesClick}
					onSuppliersClick={handleSuppliersClick}
					onDashboardClick={handleDashboardClick}
				/>
			)}
		</div>
	);
};
