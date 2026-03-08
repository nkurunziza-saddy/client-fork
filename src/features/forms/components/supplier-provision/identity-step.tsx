import { RiArrowRightLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as AdminCard } from "@/features/admin/components/card";
import { FormField } from "@/shared/components";

const industries = [
	"Electronics",
	"Fashion & Textiles",
	"Home & Garden",
	"Beauty & Health",
	"Automotive",
	"Industrial Equipment",
	"Food & Beverages",
	"Agriculture",
	"Construction",
	"Technology",
	"Healthcare",
	"Education",
	"Other",
];

const rwandaLocations = [
	"Kigali City",
	"Eastern Province",
	"Northern Province",
	"Southern Province",
	"Western Province",
];

interface IdentityStepProps {
	form: any;
	mode: "add" | "edit";
}

export const IdentityStep: React.FC<IdentityStepProps> = ({ form, mode }) => {
	return (
		<AdminCard
			title="Company Details"
			subtitle={
				mode === "add"
					? "Basic information about your company"
					: "Update company information"
			}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<form.Field name="companyName">
					{(field: any) => (
						<FormField label="Company Name" required>
							<Input
								id="companyName"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="OFFICIAL NAME..."
								required
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="industry">
					{(field: any) => (
						<FormField label="Industry" required>
							<select
								id="industry"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full px-4 py-3 border border-border/40 rounded-none focus:outline-none focus:border-primary/40 h-12 text-sm bg-background font-bold uppercase tracking-widest"
								required
							>
								<option value="">SELECT INDUSTRY...</option>
								{industries.map((ind) => (
									<option key={ind} value={ind}>
										{ind.toUpperCase()}
									</option>
								))}
							</select>
						</FormField>
					)}
				</form.Field>
				<form.Field name="registrationId">
					{(field: any) => (
						<FormField label="Registration ID (TIN/RDB)" required>
							<Input
								id="registrationId"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="TIN-000-000-000"
								required
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="location">
					{(field: any) => (
						<FormField label="Province" required>
							<select
								id="location"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full px-4 py-3 border border-border/40 rounded-none focus:outline-none focus:border-primary/40 h-12 text-sm bg-background font-bold uppercase tracking-widest"
								required
							>
								<option value="">SELECT PROVINCE...</option>
								{rwandaLocations.map((loc) => (
									<option key={loc} value={loc}>
										{loc.toUpperCase()}
									</option>
								))}
							</select>
						</FormField>
					)}
				</form.Field>
				<form.Field name="district">
					{(field: any) => (
						<FormField label="District" required>
							<Input
								id="district"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="DISTRICT NAME..."
								required
							/>
						</FormField>
					)}
				</form.Field>
				<form.Field name="sectorAddress">
					{(field: any) => (
						<FormField label="Sector & Street Address">
							<Input
								id="sectorAddress"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-medium uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="SECTOR, STREET, BLDG..."
							/>
						</FormField>
					)}
				</form.Field>{" "}
			</div>

			{mode === "edit" && (
				<div className="flex justify-end pt-6 border-t border-border/40 mt-4">
					<Button
						type="submit"
						className="rounded-none h-12 px-8 font-heading font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 border-none"
					>
						Next: Contact Person
						<RiArrowRightLine size={16} className="ml-2" />
					</Button>
				</div>
			)}
		</AdminCard>
	);
};
