import { useForm } from "@tanstack/react-form";
import type React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components";
import { categoryOptions, type CategoryFormValues } from "@/shared/schemas/business";

interface CategoryFormProps {
	onSubmit: (values: CategoryFormValues) => void;
	onCancel: () => void;
	initialValues?: Partial<CategoryFormValues>;
	mode: "add" | "edit";
	serverError?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	onSubmit,
	onCancel,
	initialValues,
	mode,
	serverError,
}) => {
	const form = useForm({
		...categoryOptions,
		defaultValues: {
			...categoryOptions.defaultValues,
			name: initialValues?.name ?? "",
			description: initialValues?.description ?? "",
			icon: initialValues?.icon ?? "",
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
			className="space-y-6 pt-4"
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
			<form.Field
				name="name"
				children={(field) => (
					<FormField
						label="Category Name"
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
							className="h-12 text-sm bg-background font-bold uppercase tracking-wider rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="ENTER NAME..."
						/>
					</FormField>
				)}
			/>

			<form.Field
				name="description"
				children={(field) => (
					<FormField
						label="Description"
						required
						error={getFormFieldErrors(field.state.meta.errors)}
						isTouched={field.state.meta.isTouched}
					>
						<Textarea
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							rows={3}
							className="text-sm resize-none bg-background font-medium uppercase tracking-wider rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="ENTER DESCRIPTION..."
						/>
					</FormField>
				)}
			/>

			{mode === "add" && (
				<form.Field
					name="icon"
					children={(field) => (
						<FormField
							label="Icon Reference"
							error={getFormFieldErrors(field.state.meta.errors)}
							isTouched={field.state.meta.isTouched}
						>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-12 text-sm bg-background font-mono rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="e.g., Smartphone, Shirt..."
							/>
						</FormField>
					)}
				/>
			)}

			<div className="flex gap-3 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex-1 rounded-none border border-border/40 h-11 font-heading font-black uppercase text-[10px] tracking-widest shadow-none"
				>
					Cancel
				</Button>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							disabled={!canSubmit || isSubmitting}
							className="flex-1 rounded-none h-11 font-heading font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 border-none"
						>
							{isSubmitting
								? "Saving..."
								: mode === "add"
									? "Create Category"
									: "Save Changes"}
						</Button>
					)}
				/>
			</div>
		</form>
	);
};
