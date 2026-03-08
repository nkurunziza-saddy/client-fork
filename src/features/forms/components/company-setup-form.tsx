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
import { Textarea } from "@/components/ui/textarea";

interface CompanySetupFormProps {
	onSubmit: (data: any) => void;
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
	const form = useForm({
		defaultValues: {
			name: "",
			categoryId: "",
			companyType: "SUPPLIER_RETAILER",
			province: "",
			district: "",
			sector: "",
			cell: "",
			village: "",
			description: "",
		},
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
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Company Name *
								</label>
								<div className="relative group">
									<RiBuildingLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
									<Input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="pl-12 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
										placeholder="e.g. AfriBuild Ltd"
										required
									/>
								</div>
							</div>
						)}
					/>
					<form.Field
						name="companyType"
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Company Type *
								</label>
								<select
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="w-full h-14 px-4 bg-muted/30 border border-transparent focus:border-primary focus:ring-0 outline-none rounded-sm transition-all text-sm shadow-none appearance-none"
									required
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
							</div>
						)}
					/>
				</div>

				{/* Category */}
				<form.Field
					name="categoryId"
					children={(field) => (
						<div>
							<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
								Main Category *
							</label>
							<select
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full h-14 px-4 bg-muted/30 border border-transparent focus:border-primary focus:ring-0 outline-none rounded-sm transition-all text-sm shadow-none appearance-none"
								required
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
						</div>
					)}
				/>

				{/* Location (Province & District) */}
				<div className="grid grid-cols-2 gap-4">
					<form.Field
						name="province"
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Province *
								</label>
								<div className="relative group">
									<RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
									<Input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="pl-12 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
										placeholder="Province"
										required
									/>
								</div>
							</div>
						)}
					/>
					<form.Field
						name="district"
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									District *
								</label>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="District"
									required
								/>
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
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Sector *
								</label>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Sector"
									required
								/>
							</div>
						)}
					/>
					<form.Field
						name="cell"
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Cell *
								</label>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Cell"
									required
								/>
							</div>
						)}
					/>
					<form.Field
						name="village"
						children={(field) => (
							<div>
								<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
									Village *
								</label>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="px-4 h-14 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none"
									placeholder="Village"
									required
								/>
							</div>
						)}
					/>
				</div>

				{/* Description */}
				<form.Field
					name="description"
					children={(field) => (
						<div>
							<label className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">
								Company Description (Optional)
							</label>
							<Textarea
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="p-4 bg-muted/30 border border-transparent focus:border-primary rounded-sm transition-all text-sm shadow-none min-h-[100px]"
								placeholder="Tell buyers what your company does..."
							/>
						</div>
					)}
				/>
			</div>

			<div className="flex flex-col gap-3 pt-4 border-t border-border">
				<Button
					type="submit"
					disabled={isLoading}
					className="w-full h-14 text-sm font-heading font-bold uppercase tracking-widest rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-none"
				>
					{isLoading ? "Creating Profile..." : "Complete Setup"}
					{!isLoading && <RiArrowRightLine className="ml-2 w-5 h-5" />}
				</Button>
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
