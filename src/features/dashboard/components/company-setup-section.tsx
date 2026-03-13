import { Await, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { CompanySetupForm } from "@/features/forms/components/company-setup-form";
import { getErrorFromRtkQuery } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCreateCompanyMutation } from "@/services/api/companies";

interface CompanySetupSectionProps {
	deferredCategories: Promise<{ categories: any }>;
}

export function CompanySetupSection({ deferredCategories }: CompanySetupSectionProps) {
	const navigate = useNavigate();
	const [createCompany, { isLoading: creatingCompany, error: createError }] =
		useCreateCompanyMutation();

	const handleCompanySubmit = async (values: any) => {
		try {
			const payload = {
				name: values.name,
				category: values.categoryId,
				type: values.companyType,
				province: values.province,
				district: values.district,
				sector: values.sector,
				cell: values.cell,
				village: values.village,
				description: values.description,
			};

			await createCompany(payload).unwrap();
			toast.success("Company profile created successfully!");
		} catch (err) {
			console.error("Company creation failed", err);
		}
	};

	const serverError = getErrorFromRtkQuery(createError);

	return (
		<Suspense fallback={<div className="container mx-auto max-w-3xl py-12 px-4"><Skeleton className="h-[600px] w-full" /></div>}>
			<Await promise={deferredCategories}>
				{({ categories }) => (
					<div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
						<div className="mb-10 text-center">
							<h1 className="text-2xl font-heading font-black uppercase tracking-tighter text-foreground mb-3 shadow-sm inline-block px-4 py-2 bg-primary/5 border border-primary/10">
								Setup Your Provider Account
							</h1>
							<p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
								Create your company profile to start listing products and services.
							</p>
						</div>
						<div className="bg-card border border-border/40 p-6 sm:p-10 shadow-sm relative overflow-hidden">
							<div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

							<div className="relative z-10">
								<CompanySetupForm
									onSubmit={handleCompanySubmit}
									isLoading={creatingCompany}
									categories={categories?.data}
									onSkip={() => navigate({ to: "/" })}
									serverError={serverError}
								/>
							</div>
						</div>
					</div>
				)}
			</Await>
		</Suspense>
	);
}
