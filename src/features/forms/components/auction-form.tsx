import { useForm } from "@tanstack/react-form";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import type React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFormFieldErrors } from "@/lib/utils";
import { auctionOptions, type AuctionFormValues } from "@/shared/schemas/business";
import { Textarea } from "@/components/ui/textarea";
import { useUploadMediaMutation } from "@/services/api/media";
import { FormField } from "@/shared/components/form-field";
import { useFileUpload } from "@/shared/hooks/use-file-upload";



interface AuctionFormProps {
	onSubmit: (
		values: Omit<AuctionFormValues, "startingPrice"> & {
			startingPrice: number;
		},
	) => void;
	onCancel: () => void;
	initialValues?: Partial<AuctionFormValues>;
	isLoading?: boolean;
	serverError?: string;
}

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;

const toDateTimeLocal = (val?: string | Date) => {
	if (!val) return "";
	const d = new Date(val);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().slice(0, 16);
};

export const AuctionForm: React.FC<AuctionFormProps> = ({
	onSubmit,
	onCancel,
	initialValues,
	isLoading,
	serverError,
}) => {
	const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

	const [
		{ files, isDragging, errors: uploadErrors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/png,image/jpeg,image/jpg,image/webp",
		maxFiles: MAX_IMAGES,
		maxSize: MAX_SIZE_MB * 1024 * 1024,
		multiple: true,
	});

	const form = useForm({
		...auctionOptions,
		defaultValues: {
			...auctionOptions.defaultValues,
			title: initialValues?.title ?? "",
			description: initialValues?.description ?? "",
			startingPrice: initialValues?.startingPrice ?? "",
			startDate: toDateTimeLocal(initialValues?.startDate),
			endDate: toDateTimeLocal(initialValues?.endDate),
			imageUrls: initialValues?.imageUrls ?? [],
		},
		onSubmit: async ({ value }) => {
			let newUploadedUrls: string[] = [];
			const filesToUpload = files
				.map((f) => f.file)
				.filter((f): f is File => f instanceof File);
			if (filesToUpload.length > 0) {
				const formData = new FormData();
				for (const f of filesToUpload) {
					formData.append("files", f);
				}
				formData.append("folder", "auctions");
				try {
					const res = await uploadMedia(formData).unwrap();
					newUploadedUrls = res.map((r) => r.url);
				} catch (uploadErr) {
					console.error("Upload failed", uploadErr);
					return;
				}
			}
			onSubmit({
				...value,
				startingPrice: Number(value.startingPrice) || 0,
				imageUrls: [...value.imageUrls, ...newUploadedUrls],
			});
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
			<form.Field
				name="title"
				children={(field) => (
					<FormField
						label="Auction Title"
						required
						error={getFormFieldErrors(field.state.meta.errors)}
					>
						<Input
							id={field.name}
							aria-label="Auction Title"
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="Enter auction title"
						/>
					</FormField>
				)}
			/>

			<form.Field
				name="startingPrice"
				children={(field) => (
					<FormField
						label="Starting Price (RWF)"
						required
						error={getFormFieldErrors(field.state.meta.errors)}
					>
						<Input
							id={field.name}
							aria-label="Starting Price"
							name={field.name}
							value={field.state.value}
							type="number"
							min="0"
							step="0.01"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="0.00"
						/>
					</FormField>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<form.Field
					name="startDate"
					children={(field) => (
						<FormField
							label="Start Date & Time"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
						>
							<Input
								id={field.name}
								aria-label="Start Date"
								name={field.name}
								value={field.state.value}
								type="datetime-local"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							/>
						</FormField>
					)}
				/>
				<form.Field
					name="endDate"
					children={(field) => (
						<FormField
							label="End Date & Time"
							required
							error={getFormFieldErrors(field.state.meta.errors)}
						>
							<Input
								id={field.name}
								aria-label="End Date"
								name={field.name}
								value={field.state.value}
								type="datetime-local"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							/>
						</FormField>
					)}
				/>
			</div>

			<form.Field
				name="description"
				children={(field) => (
					<FormField
						label="Description"
						error={getFormFieldErrors(field.state.meta.errors)}
					>
						<Textarea
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							rows={4}
							className="text-sm resize-none bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
							placeholder="Detail the item or property being auctioned..."
						/>
					</FormField>
				)}
			/>

			<div>
				<form.Field
					name="imageUrls"
					children={(field) => {
						const existingImages = field.state.value || [];
						const remainingSlots = MAX_IMAGES - existingImages.length;

						return (
							<div className="space-y-4">
								{existingImages.length > 0 && (
									<div className="space-y-2">
										<label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
											Existing Images ({existingImages.length})
										</label>
										<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
											{existingImages.map((url: string, i: number) => (
												<div
													key={url}
													className="relative aspect-square border border-border/40 bg-muted/20"
												>
													<img
														src={url}
														alt={`Existing ${i}`}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.currentTarget.src = "/image-fallback.svg";
														}}
													/>
													<Button
														type="button"
														onClick={() =>
															field.handleChange(
																existingImages.filter(
																	(_: any, index: number) => index !== i,
																),
															)
														}
														className="absolute -top-1.5 -right-1.5 size-5 rounded-none p-0 bg-destructive/80 hover:bg-destructive text-primary-foreground backdrop-blur-md border border-background"
													>
														<XIcon className="size-3" />
													</Button>
												</div>
											))}
										</div>
									</div>
								)}

								<FormField
									label={`New Auction Images (up to ${remainingSlots} more)`}
									error={getFormFieldErrors(field.state.meta.errors)}
								>
									<div
										className="relative flex min-h-36 flex-col items-center not-data-files:justify-center overflow-hidden rounded-none border border-dashed border-border/40 p-3 transition-colors data-[dragging=true]:bg-accent/50"
										data-dragging={isDragging || undefined}
										data-files={files.length > 0 || undefined}
										onDragEnter={handleDragEnter}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
									>
										<input
											{...getInputProps()}
											aria-label="Upload auction images"
											className="sr-only"
										/>
										{files.length > 0 ? (
											<div className="flex w-full flex-col gap-3">
												<div className="flex items-center justify-between gap-2">
													<span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
														{files.length} / {remainingSlots} new images
														selected
													</span>
													{files.length < remainingSlots && (
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
												<div className="grid grid-cols-3 gap-2">
													{files.map((file) => (
														<div
															className="relative aspect-square rounded-none border border-border/20 bg-muted overflow-hidden"
															key={file.id}
														>
															<img
																alt={file.file.name}
																className="size-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
																src={file.preview}
																onError={(e) => {
																	e.currentTarget.src = "/image-fallback.svg";
																}}
															/>
															<Button
																type="button"
																aria-label="Remove image"
																className="-top-1.5 -right-1.5 absolute size-5 rounded-none border border-background shadow-none focus-visible:border-background bg-background/80 backdrop-blur-md"
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
													PNG, JPG, or WebP (max {MAX_SIZE_MB}MB)
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
								</FormField>
							</div>
						);
					}}
				/>
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
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							disabled={!canSubmit || isLoading || isUploading || isSubmitting}
							className="flex-1 rounded-none h-11 font-heading font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20"
						>
							{isUploading || isSubmitting
								? "Uploading..."
								: isLoading
									? "Saving..."
									: initialValues?.title
										? "Save Changes"
										: "Create Auction"}
						</Button>
					)}
				/>
			</div>
		</form>
	);
};
