import {
	RiArrowLeftSLine,
	RiBuildingLine,
	RiCheckboxCircleLine,
	RiUserLine,
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SupplierProvisionForm } from "@/features/forms/components/supplier-provision-form";
import { useCreateCompanyMutation } from "@/services/api/companies";
import { Card } from "./card";
import { PageHeader } from "./page-header";

export function AdminAddSupplierPage() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [createCompany, { isLoading }] = useCreateCompanyMutation();

	const handleSubmit = async (values: any) => {
		try {
			const created = await createCompany({
				name: values.companyName,
				type: values.industry || undefined,
				description: values.position || undefined,
				province: values.location || undefined,
				district: values.district || undefined,
				sector: values.sectorAddress || undefined,
				isActive: true,
				isVerified: false,
			}).unwrap();
			navigate({
				to: "/admin/suppliers/$supplierId",
				params: { supplierId: created.id },
			});
		} catch (error) {
			console.error(error);
		}
	};

	const steps = [
		{ step: 1, label: "Company", icon: RiBuildingLine },
		{ step: 2, label: "Contact", icon: RiUserLine },
		{ step: 3, label: "Confirm", icon: RiCheckboxCircleLine },
	];

	return (
		<div className="space-y-5 pb-10">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					onClick={() => navigate({ to: "/admin/suppliers" })}
					className="group flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider text-foreground hover:bg-muted"
				>
					<RiArrowLeftSLine
						size={16}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Back to Suppliers
				</Button>
			</div>

			<PageHeader
				title="New Supplier"
				subtitle="Onboard a supplier account"
				badge="Supplier Management"
			/>

			<Card noPadding>
				<div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-6">
					{steps.map((item, index) => (
						<div
							key={item.step}
							className="relative z-10 flex w-1/3 flex-col items-center"
						>
							<div className="relative flex items-center justify-center">
								<div
									className={`z-10 flex h-12 w-12 items-center justify-center rounded-sm border shadow-lg transition-all duration-500 ${
										currentStep >= item.step
											? "scale-110 border-primary bg-primary text-primary-foreground shadow-primary/20"
											: "border-border bg-background text-muted-foreground shadow-none"
									}`}
								>
									<item.icon size={20} />
								</div>
								{index < 2 && (
									<div
										className={`absolute top-1/2 left-1/2 -z-10 h-[2px] w-full -translate-y-1/2 translate-x-6 border-t-2 border-dashed ${
											currentStep > item.step
												? "border-primary"
												: "border-border"
										}`}
										style={{ width: "calc(300% - 3rem)" }}
									/>
								)}
							</div>

							<span
								className={`mt-4 text-[10px] font-heading font-bold uppercase tracking-widest transition-colors duration-500 ${
									currentStep >= item.step
										? "text-primary"
										: "text-muted-foreground"
								}`}
							>
								{item.label}
							</span>
						</div>
					))}
				</div>
			</Card>

			<div className="mx-auto w-full max-w-3xl">
				<SupplierProvisionForm
					currentStep={currentStep}
					onStepChange={setCurrentStep}
					onSubmit={handleSubmit}
					onCancel={() => navigate({ to: "/admin/suppliers" })}
				/>
			</div>

			{isLoading && (
				<p className="text-sm text-muted-foreground">Creating supplier...</p>
			)}
		</div>
	);
}
