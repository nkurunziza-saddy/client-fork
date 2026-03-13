import type React from "react";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { useLazyCheckCompanyNameQuery } from "@/services/api/companies";
import { Card as AdminCard } from "@/features/admin/components/card";
import { FormField } from "@/shared/components/form-field";
interface IdentityStepProps {
	form: any;
	mode: "add" | "edit";
}

const industries = [
	"Construction",
	"Manufacturing",
	"Engineering",
	"Architecture",
	"Logistics",
	"Real Estate",
];

const rwandaLocations = [
	"Kigali City",
	"Northern Province",
	"Eastern Province",
	"Southern Province",
	"Western Province",
];

export const IdentityStep: React.FC<IdentityStepProps> = ({ form, mode }) => {
	const [checkCompanyName] = useLazyCheckCompanyNameQuery();

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
				<form.Field
					name="companyName"
					asyncDebounceMs={500}
					validators={{
						onChangeAsync: async ({ value }: { value: string }) => {
							if (!value || value.length < 3) return undefined;
							try {
								const res = await checkCompanyName(value).unwrap();
								if (!res.available) return "Company name is already taken";
								return undefined;
							} catch {
								return undefined;
							}
						},
					}}
					children={(field: any) => (
						<FormField
							label="Company Name"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<div className="relative group">
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
									placeholder="OFFICIAL NAME..."
								/>
								{field.state.meta.isValidating && (
									<div className="absolute right-4 top-1/2 -translate-y-1/2">
										<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
									</div>
								)}
							</div>
						</FormField>
					)}
				/>
				<form.Field
					name="industry"
					children={(field: any) => (
						<FormField
							label="Industry"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<select
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full px-4 py-3 border border-border/40 rounded-none focus:outline-none focus:border-primary/40 h-12 text-sm bg-background font-bold uppercase tracking-widest"
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
				/>
				<form.Field
					name="registrationId"
					children={(field: any) => (
						<FormField
							label="Registration ID (TIN/RDB)"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="TIN-000-000-000"
							/>
						</FormField>
					)}
				/>
				<form.Field
					name="location"
					children={(field: any) => (
						<FormField
							label="Province"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<select
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full px-4 py-3 border border-border/40 rounded-none focus:outline-none focus:border-primary/40 h-12 text-sm bg-background font-bold uppercase tracking-widest"
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
				/>
				<form.Field
					name="district"
					children={(field: any) => (
						<FormField
							label="District"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-bold uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="DISTRICT NAME..."
							/>
						</FormField>
					)}
				/>
				<form.Field
					name="sectorAddress"
					children={(field: any) => (
						<FormField
							label="Sector & Street Address"
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-medium uppercase tracking-wider shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="SECTOR, STREET, BLDG..."
							/>
						</FormField>
					)}
				/>
			</div>
		</AdminCard>
	);
};
