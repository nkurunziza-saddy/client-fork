import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import ServiceView from "@/features/marketplace/components/service-view";
import { useGetServiceByIdQuery } from "@/services/api/services";
import { PageContainer } from "@/shared/components";
import { ROUTES } from "@/shared/constants/routes";

function serviceAgeYears(dateLike?: string) {
	if (!dateLike) return "N/A";
	const created = new Date(dateLike);
	if (Number.isNaN(created.getTime())) return "N/A";
	const years = Math.max(
		1,
		Math.floor((Date.now() - created.getTime()) / 31536000000),
	);
	return `${years}+ Years`;
}

export function ServiceDetailsPage() {
	const { serviceId } = useParams({ from: "/_main/services/$serviceId" });
	const navigate = useNavigate();

	const {
		data: rawService,
		isLoading,
		error,
	} = useGetServiceByIdQuery(serviceId);

	if (isLoading) {
		return (
			<PageContainer className="flex h-[60vh] items-center justify-center">
				<div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
					Loading service...
				</div>
			</PageContainer>
		);
	}

	if (error || !rawService) {
		return (
			<PageContainer className="flex h-[60vh] items-center justify-center">
				<div className="text-center max-w-sm">
					<h1 className="mb-4 text-2xl font-display font-black uppercase tracking-tighter text-foreground">
						Service Not Found
					</h1>
					<Button
						onClick={() => navigate({ to: ROUTES.PUBLIC.SERVICES })}
						className="rounded-none font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8"
					>
						Back to Marketplace
					</Button>
				</div>
			</PageContainer>
		);
	}

	const service = {
		...rawService,
		totalRequests: rawService.totalRequests ?? 0,
		pendingRequests: 0,
		provider: {
			fullName: rawService.company?.name ?? "Unknown Provider",
			role: rawService.company?.type ?? "Service Provider",
			experience: serviceAgeYears(rawService.createdAt),
			phone: rawService.company?.phone ?? "",
			email: rawService.company?.email ?? "",
			rating: rawService.company?.rating ?? 0,
		},
	};

	return (
		<ServiceView
			service={service as any}
			onBack={() => navigate({ to: ROUTES.PUBLIC.SERVICES })}
		/>
	);
}
