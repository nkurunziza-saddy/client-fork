import { useForm } from "@tanstack/react-form";
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
import { useGetProductCategoriesQuery } from "@/services/api/product-categories";
import { FormField } from "@/shared/components/form-field";
import { ImageUploadSection } from "@/shared/components/forms/image-upload-section";
import { ResourceFormLayout } from "@/shared/components/forms/resource-form-layout";
import {
  type ProductFormValues,
  productOptions,
} from "@/shared/schemas/business";

export type { ProductFormValues };

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<ProductFormValues>;
  isLoading?: boolean;
  serverError?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  isLoading,
  serverError,
}) => {
  const { data: categoriesData } = useGetProductCategoriesQuery({ limit: 100 });
  const categories = categoriesData?.data ?? [];
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);

  const form = useForm({
    ...productOptions,
    defaultValues: {
      ...productOptions.defaultValues,
      ...initialValues,
    } as ProductFormValues,
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
        formData.append("folder", "products");
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
          submitLabel={initialValues?.name ? "Save Changes" : "Create Product"}
          submittingLabel={isUploading ? "Uploading Images..." : "Saving..."}
        >
          <form.Field
            name="name"
            children={(field) => (
              <FormField
                label="Product Name"
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
                  placeholder="Enter product name"
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
                    <SelectValue placeholder="Select category" />
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
                    label="Price (RWF)"
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
              name="stock"
              children={(field) => (
                <FormField
                  label="Stock Quantity"
                  required
                  error={getFormFieldErrors(field.state.meta.errors)}
                  isTouched={field.state.meta.isTouched}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="number"
                    min="0"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-11 text-sm bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                    placeholder="0"
                  />
                </FormField>
              )}
            />
            <form.Field
              name="unit"
              children={(field) => (
                <FormField
                  label="Unit"
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
                    placeholder="e.g. piece, kg, box"
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
                isTouched={field.state.meta.isTouched}
              >
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="text-sm resize-none bg-background rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                  placeholder="Enter product description"
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
                folder="products"
                onFilesChange={setNewFiles}
              />
            )}
          />
        </ResourceFormLayout>
      )}
    />
  );
};
