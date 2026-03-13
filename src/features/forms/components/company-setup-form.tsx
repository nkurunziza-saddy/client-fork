import {
	RiArrowRightLine,
	RiBuildingLine,
	RiMapPinLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import type React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { useLazyCheckCompanySlugQuery } from "@/services/api/companies";
import { companySetupOptions, type CompanySetupFormValues } from "@/shared/schemas/business";
import { Textarea } from "@/components/ui/textarea";


interface CompanySetupFormProps {
	onSubmit: (data: CompanySetupFormValues) => void;
	onSkip: () => void;
	isLoading?: boolean;
	categories?: any[];
	serverError?: string;
}

export const CompanySetupForm: React.FC<CompanySetupFormProps> = ({
	onSubmit,
	onSkip,
	isLoading = false,
	categories = [],
	serverError,
}) => {
	const [checkSlug] = useLazyCheckCompanySlugQuery();

	const form = useForm({
		...companySetupOptions,
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="w-full space-y-6"
		>
			{serverError && (
				<Alert
					variant="destructive"
					className="rounded-none border-destructive/20 bg-destructive/5"
				>
					<AlertDescription className="font-bold uppercase tracking-widest text-[10px]">
						{serverError}
					</AlertDescription>
				</Alert>
			)}
			<div className="space-y-4">
				{/* Name & Type */}
				<div className="grid grid-cols-2 gap-4">
					<form.Field
						name="name"
						listeners={{
							onChange: ({ value }) => {
								const slug = value
									.toLowerCase()
									.replace(/[^a-z0-9]+/g, "-")
									.replace(/^-+|-+$/g, "");
								form.setFieldValue("slug", slug);
								form.setFieldMeta("slug", (prev) => ({ ...prev, isTouched: true }));
							},
						}}
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Company Name *
								</label>
								<div className="relative group">
									<RiBuildingLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="pl-12 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
										placeholder="e.g. AfriBuild Ltd"
									/>
								</div>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
					<form.Field
						name="companyType"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Company Type *
								</label>
								<select
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="w-full h-14 px-4 bg-muted/30 border border-transparent focus:border-primary focus:ring-0 outline-none rounded-sm transition-all text-sm shadow-none appearance-none"
								>
									<option value="SUPPLIER_DEALER">Dealer</option>
									<option value="SUPPLIER_RETAILER">Retailer</option>
									<option value="SUPPLIER_WHOLESALER">
										Wholesaler/Importer
									</option>
									<option value="MANUFACTURER_RWANDA">Factory (Rwanda)</option>
									<option value="MANUFACTURER_EAC">Factory (EAC)</option>
									<option value="SERVICE_PROVIDER">Service Provider</option>
								</select>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<form.Field
					name="slug"
					asyncDebounceMs={500}
					validators={{
						onChangeAsync: async ({ value }: { value: string }) => {
							if (!value || value.length < 3) return undefined;
							try {
								const res = await checkSlug(value).unwrap();
								if (!res.available) return "This URL slug is already taken";
								return undefined;
							} catch {
								return undefined;
							}
						},
					}}
					children={(field) => (
						<div>
							<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
								Store URL Slug *
							</label>
							<div className="relative group">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground select-none pointer-events-none">
									karibu.rw/
								</div>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="pl-20 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none font-mono"
									placeholder="my-store-name"
								/>
								{field.state.meta.isValidating && (
									<div className="absolute right-4 top-1/2 -translate-y-1/2">
										<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
									</div>
								)}
							</div>
							<p className="text-[8px] text-muted-foreground mt-1 ml-1 uppercase font-bold tracking-tighter">
								This will be your permanent public URL
							</p>
							{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
								<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
									{getFormFieldErrors(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Category */}
				<form.Field
					name="categoryId"
					children={(field) => (
						<div>
							<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
								Main Category *
							</label>
							<select
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full h-14 px-4 bg-muted/30 border border-transparent focus:border-primary focus:ring-0 outline-none rounded-sm transition-all text-sm shadow-none appearance-none"
							>
								<option value="" disabled>
									Select a category
								</option>
								{categories?.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
							{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
								<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
									{getFormFieldErrors(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Location (Province & District) */}
				<div className="grid grid-cols-2 gap-4">
					<form.Field
						name="province"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Province *
								</label>
								<div className="relative group">
									<RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="pl-12 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
										placeholder="Province"
									/>
								</div>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
					<form.Field
						name="district"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									District *
								</label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="District"
								/>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				{/* Location (Sector, Cell, Village) */}
				<div className="grid grid-cols-3 gap-4">
					<form.Field
						name="sector"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Sector *
								</label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Sector"
								/>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
					<form.Field
						name="cell"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Cell *
								</label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Cell"
								/>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
					<form.Field
						name="village"
						children={(field) => (
							<div>
								<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Village *
								</label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Village"
								/>
								{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
									<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
										{getFormFieldErrors(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				{/* Description */}
				<form.Field
					name="description"
					children={(field) => (
						<div>
							<label htmlFor={field.name} className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
								Company Description (Optional)
							</label>
							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="p-4 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none min-h-[100px]"
								placeholder="Tell buyers what your company does..."
							/>
							{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
								<p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1 ml-1">
									{getFormFieldErrors(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>
			</div>

			<div className="flex flex-col gap-3 pt-4 border-t border-border">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							disabled={!canSubmit || isLoading || isSubmitting}
							className="w-full h-14 text-sm font-heading font-bold uppercase tracking-widest rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-none"
						>
							{isLoading || isSubmitting ? "Creating Profile..." : "Complete Setup"}
							{!isLoading && !isSubmitting && <RiArrowRightLine className="ml-2 w-5 h-5" />}
						</Button>
					)}
				/>
				<Button
					type="button"
					variant="ghost"
					onClick={onSkip}
					disabled={isLoading}
					className="w-full h-14 text-sm font-heading font-bold uppercase tracking-widest rounded-sm text-muted-foreground hover:text-foreground shadow-none"
				>
					Skip for now
				</Button>
			</div>
		</form>
	);
};
