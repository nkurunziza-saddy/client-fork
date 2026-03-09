import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/features/admin/components/card";
import { PageHeader } from "@/features/admin/components/page-header";
import { AuctionForm } from "@/features/forms/components/auction-form";
import { getErrorFromRtkQuery } from "@/lib/utils";
import { useCreateAuctionMutation } from "@/services/api/auctions";
import { useGetMyCompanyQuery } from "@/services/api/companies";

export const Route = createFileRoute("/dashboard/auctions/new")({
  component: NewAuctionPage,
});

function NewAuctionPage() {
  const navigate = useNavigate();
  const [createAuction, { isLoading, error }] = useCreateAuctionMutation();
  const { data: company } = useGetMyCompanyQuery();

  const handleSubmit = async (values: any) => {
    if (!company?.id) {
      toast.error("Company not found. Ensure you are linked to a company.");
      return;
    }

    try {
      const { imageUrls, ...restValues } = values;
      await createAuction({
        ...restValues,
        companyId: company.id,
        images: imageUrls,
      }).unwrap();
      toast.success(
        "Auction created successfully and is pending admin approval.",
      );
      navigate({ to: "/dashboard/auctions" });
    } catch (error) {
      console.error(error);
    }
  };

  const serverError = getErrorFromRtkQuery(error);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-14">
      <PageHeader
        title="List New Auction"
        subtitle="Create a new auction for review and bidding"
        badge="Supplier Dashboard"
      />

      <Card noPadding>
        <div className="p-6">
          <AuctionForm
            onSubmit={handleSubmit}
            onCancel={() => navigate({ to: "/dashboard/auctions" })}
            isLoading={isLoading}
            serverError={serverError}
          />
        </div>
      </Card>
    </div>
  );
}
