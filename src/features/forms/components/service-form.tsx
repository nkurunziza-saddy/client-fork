import { useForm } from "@tanstack/react-form";
import {
	AlertCircleIcon,
	ClockIcon,
	ImageIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";
import type React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetServiceCategoriesQuery } from "@/services/api/service-categories";
import { useFileUpload } from "@/shared/hooks/use-file-upload";

interface ServiceFormValues {
	name: string;
	categoryId: string;
	description: string;
	price: string;
	priceType: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
	duration: string;
	discount: string;
	imageUrls: string[];
}

interface ServiceFormProps {
	onSubmit: (values: ServiceFormValues) => void;
	onCancel: () => void;
	initialValues?: Partial<ServiceFormValues>;
	isLoading?: boolean;
	serverError?: string;
}

const MAX_IMAGES = 8;
const MAX_SIZE_MB = 5;

export const ServiceForm: React.FC<ServiceFormProps> = ({
	onSubmit,
	onCancel,
	initialValues,
	isLoading,
	serverError,
}) => {
	const { data: categoriesData } = useGetServiceCategoriesQuery({ limit: 100 });
	const categories = categoriesData?.data ?? [];

	const [
		{ files, isDragging, errors: uploadErrors },
		{
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
		maxFiles: MAX_IMAGES,
		maxSize: MAX_SIZE_MB * 1024 * 1024,
		multiple: true,
	});

	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			categoryId: initialValues?.categoryId ?? "",
			description: initialValues?.description ?? "",
			price: initialValues?.price ?? "",
			priceType: initialValues?.priceType ?? "FIXED",
			duration: initialValues?.duration ?? "",
			discount: initialValues?.discount?.toString() ?? "",
			imageUrls: initialValues?.imageUrls ?? [],
		} as ServiceFormValues,
		onSubmit: async ({ value }) => {
			const newPreviews = files.map((f) => f.preview ?? "").filter(Boolean);
			onSubmit({ ...value, imageUrls: [...value.imageUrls, ...newPreviews] });
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-5"
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

			{/* Name */}
			<form.Field name="name">
				{(field) => (
					<div>
						<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
							Service Name
						</Label>
						<Input
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="e.g. Electrical Installation"
							required
						/>
					</div>
				)}
			</form.Field>

			{/* Category */}
			<form.Field name="categoryId">
				{(field) => (
					<div>
						<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
							Category
						</Label>
						<Select
							value={field.state.value}
							onValueChange={(val) => field.handleChange(val ?? "")}
							required
						>
							<SelectTrigger className="h-11 bg-background rounded-none border-border/40 focus:ring-0">
								<SelectValue placeholder="Select service category" />
							</SelectTrigger>
							<SelectContent className="rounded-none border-border/40">
								{categories.map((cat: { id: string; name: string }) => (
									<SelectItem
										key={cat.id}
										value={cat.id}
										className="rounded-none"
									>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</form.Field>

			{/* Price Type + Price */}
			<div className="grid grid-cols-2 gap-4">
				<form.Field name="priceType">
					{(field) => (
						<div>
							<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
								Pricing Type
							</Label>
							<Select
								value={field.state.value}
								onValueChange={(val: any) => {
									if (val) field.handleChange(val);
								}}
								required
							>
								<SelectTrigger className="h-11 bg-background rounded-none border-border/40 focus:ring-0">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent className="rounded-none border-border/40">
									<SelectItem value="FIXED" className="rounded-none">
										Fixed Price
									</SelectItem>
									<SelectItem value="NEGOTIABLE" className="rounded-none">
										Negotiable
									</SelectItem>
									<SelectItem value="STARTS_AT" className="rounded-none">
										Starts At
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</form.Field>
				<form.Field name="price">
					{(field) => (
						<div>
							<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
								Rate (RWF)
							</Label>
							<Input
								name={field.name}
								value={field.state.value}
								type="number"
								min="0"
								step="0.01"
								disabled={form.getFieldValue("priceType") === "NEGOTIABLE"}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder={
									form.getFieldValue("priceType") === "NEGOTIABLE"
										? "N/A"
										: "0.00"
								}
								required={form.getFieldValue("priceType") !== "NEGOTIABLE"}
							/>
						</div>
					)}
				</form.Field>
			</div>

			{/* Duration + Discount */}
			<div className="grid grid-cols-2 gap-4">
				<form.Field name="duration">
					{(field) => (
						<div>
							<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
								Timeline / Duration
							</Label>
							<div className="relative group">
								<ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="h-11 text-sm bg-background pl-10 rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
									placeholder="e.g. 2-3 days"
								/>
							</div>
						</div>
					)}
				</form.Field>
				<form.Field name="discount">
					{(field) => (
						<div>
							<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
								Discount (%)
							</Label>
							<Input
								name={field.name}
								value={field.state.value}
								type="number"
								min="0"
								max="100"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
								placeholder="0"
							/>
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name="description">
				{(field) => (
					<div>
						<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
							Service Description
						</Label>
						<Textarea
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							rows={4}
							className="text-sm resize-none bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="Describe your service in detail..."
						/>
					</div>
				)}
			</form.Field>

			{/* Images */}
			<div>
				<Label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
					Portfolio Images (up to {MAX_IMAGES})
				</Label>
				<div
					className="relative flex min-h-36 flex-col items-center not-data-files:justify-center overflow-hidden rounded-none border border-dashed border-border/40 p-3 transition-colors data-[dragging=true]:bg-accent/50"
					data-dragging={isDragging || undefined}
					data-files={files.length > 0 || undefined}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<input
						{...getInputProps()}
						aria-label="Upload portfolio images"
						className="sr-only"
					/>
					{files.length > 0 ? (
						<div className="flex w-full flex-col gap-3">
							<div className="flex items-center justify-between gap-2">
								<span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
									{files.length} / {MAX_IMAGES} images selected
								</span>
								{files.length < MAX_IMAGES && (
									<Button
										type="button"
										onClick={openFileDialog}
										size="sm"
										variant="outline"
										className="h-7 text-[9px] font-black uppercase rounded-none border-border/40"
									>
										<UploadIcon className="size-3 mr-1" />
										Add More
									</Button>
								)}
							</div>
							<div className="grid grid-cols-4 gap-2">
								{files.map((file) => (
									<div
										className="relative aspect-square rounded-none border border-border/20 bg-muted overflow-hidden"
										key={file.id}
									>
										<img
											alt={file.file.name}
											className="size-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
											src={file.preview}
										/>
										<Button
											type="button"
											aria-label="Remove image"
											className="-top-1.5 -right-1.5 absolute size-5 rounded-none border border-background shadow-none focus-visible:border-background bg-slate-950/80 backdrop-blur-md"
											onClick={() => removeFile(file.id)}
											size="icon"
										>
											<XIcon className="size-3 text-primary" />
										</Button>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
							<div className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-none border border-border/40 bg-background">
								<ImageIcon className="size-4 opacity-60" />
							</div>
							<p className="mb-1 font-black uppercase tracking-widest text-[10px]">
								Drop images here
							</p>
							<p className="text-muted-foreground text-[9px] uppercase font-bold tracking-tighter">
								Showcase your work (max {MAX_SIZE_MB}MB)
							</p>
							<Button
								type="button"
								className="mt-3 h-8 text-[10px] font-black uppercase rounded-none"
								onClick={openFileDialog}
								variant="outline"
							>
								<UploadIcon className="size-3 mr-1 opacity-60" />
								Select Images
							</Button>
						</div>
					)}
				</div>
				{uploadErrors.length > 0 && (
					<div
						className="flex items-center gap-1 text-destructive text-[10px] font-black uppercase tracking-widest mt-1.5"
						role="alert"
					>
						<AlertCircleIcon className="size-3 shrink-0" />
						<span>{uploadErrors[0]}</span>
					</div>
				)}
			</div>

			<div className="flex gap-3 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex-1 rounded-none border border-border/40 h-11 font-heading font-black uppercase text-[10px] tracking-[0.2em]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isLoading}
					className="flex-1 rounded-none h-11 font-heading font-black uppercase text-[10px] tracking-[0.2em] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
				>
					{isLoading ? "Saving..." : "Create Service"}
				</Button>
			</div>
		</form>
	);
};
