import { RiArrowLeftLine, RiSaveLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as AdminCard } from "@/features/admin/components/card";
import { FormField } from "@/shared/components";

interface AgentStepProps {
	form: any;
	mode: "add" | "edit";
	onBack: () => void;
}

export const AgentStep: React.FC<AgentStepProps> = ({ form, mode, onBack }) => {
	return (
		<AdminCard
			title={mode === "add" ? "Contact Person" : "Contact Details"}
			subtitle={
				mode === "add"
					? "Details of the person managing this account"
					: "Update contact information"
			}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<form.Field name="fullName">
					{(field: any) => (
						<FormField label="Full Name" required>
							<Input
								id="fullName"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="LEGAL FULL NAME..."
								required
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="email">
					{(field: any) => (
						<FormField label="Email Address" required>
							<Input
								id="email"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								type="email"
								className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="AGENT@COMPANY.RW"
								required
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="phoneNumber">
					{(field: any) => (
						<FormField label="Phone Number" required>
							<Input
								id="phoneNumber"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								type="tel"
								className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="+250 7XX XXX XXX"
								required
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="position">
					{(field: any) => (
						<FormField label="Job Title">
							<Input
								id="position"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="E.G. DIRECTOR..."
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="nationalId">
					{(field: any) => (
						<FormField label="National ID (NID)">
							<Input
								id="nationalId"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-mono font-bold shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="1 199X X XXXXXXX X XX"
							/>
						</FormField>
					)}
				</form.Field>
			</div>
			{mode === "edit" && (
				<div className="flex justify-between pt-6 border-t border-border/40 mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="rounded-none h-12 px-6 border border-border/40 font-heading font-black uppercase text-[10px] tracking-widest shadow-none"
					>
						<RiArrowLeftLine size={16} className="mr-2" />
						Back
					</Button>
					<Button
						type="submit"
						className="rounded-none h-12 px-8 font-heading font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 border-none"
					>
						<RiSaveLine size={16} className="mr-2" />
						Save Changes
					</Button>
				</div>
			)}
		</AdminCard>
	);
};
