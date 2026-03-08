import {
	RiArrowLeftLine,
	RiArrowRightLine,
	RiSaveLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import type React from "react";
import { Button } from "@/components/ui/button";
import { AgentStep } from "./supplier-provision/agent-step";
import { IdentityStep } from "./supplier-provision/identity-step";
import { ReviewStep } from "./supplier-provision/review-step";

interface SupplierProvisionFormProps {
	currentStep: number;
	onStepChange: (step: number) => void;
	onSubmit: (values: any) => void;
	onCancel: () => void;
	initialValues?: any;
	mode?: "add" | "edit";
}

export const SupplierProvisionForm: React.FC<SupplierProvisionFormProps> = ({
	currentStep,
	onStepChange,
	onSubmit,
	onCancel,
	initialValues,
	mode = "add",
}) => {
	const form = useForm({
		defaultValues: initialValues || {
			companyName: "",
			industry: "",
			registrationId: "",
			location: "",
			district: "",
			sectorAddress: "",
			fullName: "",
			email: "",
			phoneNumber: "",
			position: "",
			nationalId: "",
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	const handleNext = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (currentStep < (mode === "add" ? 3 : 2)) {
			onStepChange(currentStep + 1);
		} else {
			form.handleSubmit();
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			onStepChange(currentStep - 1);
		} else {
			onCancel();
		}
	};

	return (
		<form onSubmit={handleNext} className="w-full space-y-6">
			{currentStep === 1 && <IdentityStep form={form} mode={mode} />}

			{currentStep === 2 && (
				<AgentStep form={form} mode={mode} onBack={handleBack} />
			)}

			{currentStep === 3 && mode === "add" && <ReviewStep form={form} />}

			{mode === "add" && (
				<div className="flex justify-between gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={handleBack}
						className="flex-1 items-center gap-2 px-6 h-12 border border-border rounded-sm font-heading font-bold uppercase text-xs tracking-widest transition-all shadow-none"
					>
						<RiArrowLeftLine size={16} />
						{currentStep === 1 ? "Cancel" : "Back"}
					</Button>

					{currentStep < 3 ? (
						<Button
							type="submit"
							className="flex-[2] items-center gap-2 px-6 h-12 rounded-sm shadow-none bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold uppercase text-xs tracking-widest"
						>
							Next Step
							<RiArrowRightLine size={16} />
						</Button>
					) : (
						<Button
							type="submit"
							className="flex-[2] items-center gap-2 px-6 h-12 bg-green-600 hover:bg-green-700 text-white border-none rounded-sm font-heading font-bold uppercase text-xs tracking-widest shadow-none"
						>
							<RiSaveLine size={16} />
							Register Company
						</Button>
					)}
				</div>
			)}
		</form>
	);
};
