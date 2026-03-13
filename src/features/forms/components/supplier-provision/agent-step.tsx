import { RiArrowLeftLine, RiSaveLine } from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { useLazyCheckPhoneQuery } from "@/services/api/users";
import { Card as AdminCard } from "@/features/admin/components/card";
import { FormField } from "@/shared/components/form-field";

interface AgentStepProps {
	form: any;
	mode: "add" | "edit";
	onBack: () => void;
}

export const AgentStep: React.FC<AgentStepProps> = ({ form, mode, onBack }) => {
	const [checkPhone] = useLazyCheckPhoneQuery();

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
						<FormField
							label="Full Name"
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
								placeholder="LEGAL FULL NAME..."
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="email">
					{(field: any) => (
						<FormField
							label="Email Address"
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
								type="email"
								className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="AGENT@COMPANY.RW"
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field
					name="phoneNumber"
					asyncDebounceMs={500}
					validators={{
						onChangeAsync: async ({ value }: { value: string }) => {
							if (!value || value.length < 10) return undefined;
							try {
								const res = await checkPhone(value).unwrap();
								if (!res.available) return "Phone number is already registered";
								return undefined;
							} catch {
								return undefined;
							}
						},
					}}
					children={(field: any) => (
						<FormField
							label="Phone Number"
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
									type="tel"
									className="h-12 text-sm bg-background font-mono font-bold uppercase tracking-widest shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
									placeholder="+250 7XX XXX XXX"
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

				<form.Field name="position">
					{(field: any) => (
						<FormField
							label="Job Title"
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
								placeholder="E.G. DIRECTOR..."
							/>
						</FormField>
					)}
				</form.Field>

				<form.Field name="nationalId">
					{(field: any) => (
						<FormField
							label="National ID (NID)"
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Input
								id={field.name}
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
