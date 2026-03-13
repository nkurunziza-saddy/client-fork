import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import ServiceView from "@/features/marketplace/components/service-view";
import { useGetServiceByIdQuery } from "@/services/api/services";
import { ROUTES } from "@/shared/constants/routes";
import { DetailPageSkeleton } from "@/shared/components/skeletons";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Building2 } from "lucide-react";

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
    return <DetailPageSkeleton />;
  }

  if (error || !rawService) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Empty className="max-w-md w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 className="w-4 h-4 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-display font-black uppercase">
              Service Not Found
            </EmptyTitle>
            <EmptyDescription className="uppercase tracking-widest text-[10px]">
              The service you are looking for may have been removed or does not
              exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => navigate({ to: ROUTES.PUBLIC.SERVICES })}
              className="rounded-none h-11 px-8 font-black uppercase text-[10px] tracking-widest"
            >
              Back to Marketplace
            </Button>
          </EmptyContent>
        </Empty>
      </div>
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
