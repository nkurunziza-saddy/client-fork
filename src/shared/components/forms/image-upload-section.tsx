import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/shared/components/form-field";
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import { getFormFieldErrors } from "@/lib/utils";

interface ImageUploadSectionProps {
	field: any; // TanStack Form Field instance
	maxImages?: number;
	maxSizeMb?: number;
	folder: string;
	onFilesChange?: (files: any[]) => void;
}

export function ImageUploadSection({
	field,
	maxImages = 8,
	maxSizeMb = 5,
	onFilesChange,
}: ImageUploadSectionProps) {
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
		accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
		maxFiles: maxImages,
		maxSize: maxSizeMb * 1024 * 1024,
		multiple: true,
	});

	// Sync local files state back to parent if needed
	React.useEffect(() => {
		onFilesChange?.(files);
	}, [files, onFilesChange]);

	const existingImages = field.state.value || [];
	const remainingSlots = maxImages - existingImages.length;

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
									onClick={() => field.removeValue(i)}
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
				label={`New Images (up to ${remainingSlots} more)`}
				error={getFormFieldErrors(field.state.meta.errors)}
				isTouched={field.state.meta.isTouched}
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
						aria-label="Upload images"
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
								PNG, JPG, GIF or WebP (max {maxSizeMb}MB)
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
	);
}
