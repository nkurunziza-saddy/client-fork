import { useForm } from "@tanstack/react-form";
import { ClockIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getFormFieldErrors } from "@/lib/utils";
import type { FileWithPreview } from "@/types/ui";
import { useUploadMediaMutation } from "@/services/api/media";
import { useGetServiceCategoriesQuery } from "@/services/api/service-categories";
import { FormField } from "@/shared/components/form-field";
import { ImageUploadSection } from "@/shared/components/forms/image-upload-section";
import { ResourceFormLayout } from "@/shared/components/forms/resource-form-layout";
import {
  type ServiceFormValues,
  serviceOptions,
} from "@/shared/schemas/business";

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<ServiceFormValues>;
  isLoading?: boolean;
  serverError?: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  isLoading,
  serverError,
}) => {
  const { data: categoriesData } = useGetServiceCategoriesQuery({ limit: 100 });
  const categories = categoriesData?.data ?? [];
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);

  const form = useForm({
    ...serviceOptions,
    defaultValues: {
      ...serviceOptions.defaultValues,
      ...initialValues,
    } as ServiceFormValues,
    onSubmit: async ({ value }) => {
      let newUploadedUrls: string[] = [];
      const filesToUpload = newFiles
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        for (const f of filesToUpload) {
          formData.append("files", f);
        }
        formData.append("folder", "services");
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
        imageUrls: [...(value.imageUrls || []), ...newUploadedUrls],
      });
    },
  });

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <ResourceFormLayout
          onSubmit={() => form.handleSubmit()}
          onCancel={onCancel}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting || isUploading}
          isLoading={isLoading}
          serverError={serverError}
          submitLabel={initialValues?.name ? "Save Changes" : "Create Service"}
          submittingLabel={isUploading ? "Uploading Portfolio..." : "Saving..."}
        >
          <form.Field
            name="name"
            children={(field) => (
              <FormField
                label="Service Name"
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
                  className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                  placeholder="e.g. Electrical Installation"
                />
              </FormField>
            )}
          />

          <form.Field
            name="categoryId"
            children={(field) => (
              <FormField
                label="Category"
                required
                error={getFormFieldErrors(field.state.meta.errors)}
                isTouched={field.state.meta.isTouched}
              >
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val ?? "")}
                >
                  <SelectTrigger
                    aria-label="Select Category"
                    className="h-11 bg-background rounded-none border-border/40 focus:ring-0"
                  >
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
              </FormField>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="priceType"
              children={(field) => (
                <FormField
                  label="Pricing Type"
                  required
                  error={getFormFieldErrors(field.state.meta.errors)}
                  isTouched={field.state.meta.isTouched}
                >
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      if (val)
                        field.handleChange(
                          val as "FIXED" | "NEGOTIABLE" | "STARTS_AT",
                        );
                    }}
                  >
                    <SelectTrigger
                      aria-label="Select Pricing Type"
                      className="h-11 bg-background rounded-none border-border/40 focus:ring-0"
                    >
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
                </FormField>
              )}
            />
            <form.Field
              name="price"
              children={(field) => {
                const priceType = form.getFieldValue("priceType");
                const isNegotiable = priceType === "NEGOTIABLE";
                return (
                  <FormField
                    label="Rate (RWF)"
                    required={!isNegotiable}
                    error={getFormFieldErrors(field.state.meta.errors)}
                    isTouched={field.state.meta.isTouched}
                  >
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isNegotiable}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                      placeholder={isNegotiable ? "N/A" : "0.00"}
                    />
                  </FormField>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="duration"
              children={(field) => (
                <FormField
                  label="Duration"
                  required
                  error={getFormFieldErrors(field.state.meta.errors)}
                  isTouched={field.state.meta.isTouched}
                >
                  <div className="relative group">
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11 text-sm bg-background pl-10 rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                      placeholder="e.g. 2-3 days"
                    />
                  </div>
                </FormField>
              )}
            />
            <form.Field
              name="discount"
              children={(field) => (
                <FormField
                  label="Discount (%)"
                  error={getFormFieldErrors(field.state.meta.errors)}
                  isTouched={field.state.meta.isTouched}
                >
                  <Input
                    id={field.name}
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
                </FormField>
              )}
            />
          </div>

          <form.Field
            name="description"
            children={(field) => (
              <FormField
                label="Service Description"
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
                  rows={4}
                  className="text-sm resize-none bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                  placeholder="Describe your service in detail..."
                />
              </FormField>
            )}
          />

          <form.Field
            name="imageUrls"
            mode="array"
            children={(field) => (
              <ImageUploadSection
                field={field}
                folder="services"
                onFilesChange={setNewFiles}
              />
            )}
          />
        </ResourceFormLayout>
      )}
    />
  );
};
