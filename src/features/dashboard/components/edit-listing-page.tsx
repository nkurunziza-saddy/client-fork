import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/features/forms/components/product-form";
import { ServiceForm } from "@/features/forms/components/service-form";
import { getFormFieldErrors } from "@/lib/utils";
import {
  useAddProductVariantMutation,
  useGetProductByIdQuery,
  useRemoveProductVariantMutation,
  useUpdateProductMutation,
} from "@/services/api/products";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "@/services/api/services";
import { FormField } from "@/shared/components/form-field";
import { ResponsiveModal } from "@/shared/components/responsive-modal";
import type { CreateProductVariantInput } from "@/types";

const variantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .string()
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a positive number",
    }),
  stock: z
    .string()
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stock must be a non-negative number",
    }),
  unit: z.string().catch(""),
});

function AddVariantDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductVariantInput) => void;
  isLoading: boolean;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      unit: "",
    },
    validators: {
      onChange: variantSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        name: value.name.trim(),
        price: Number(value.price),
        stock: Number(value.stock),
        unit: value.unit?.trim() || undefined,
      });
      form.reset();
    },
  });

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          form.reset();
        }
      }}
      title="Add Variant"
      description="Create a new option for this product."
      size="md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          children={(field) => (
            <FormField
              label="Name"
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
                placeholder="e.g. Size L, 50kg bag"
              />
            </FormField>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="price"
            children={(field) => (
              <FormField
                label="Price"
                required
                error={getFormFieldErrors(field.state.meta.errors)}
                isTouched={field.state.meta.isTouched}
              >
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          />
          <form.Field
            name="stock"
            children={(field) => (
              <FormField
                label="Stock"
                required
                error={getFormFieldErrors(field.state.meta.errors)}
                isTouched={field.state.meta.isTouched}
              >
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          />
        </div>
        <form.Field
          name="unit"
          children={(field) => (
            <FormField
              label="Unit"
              error={getFormFieldErrors(field.state.meta.errors)}
              isTouched={field.state.meta.isTouched}
            >
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. piece, kg"
              />
            </FormField>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Adding..." : "Add Variant"}
              </Button>
            )}
          />
        </div>
      </form>
    </ResponsiveModal>
  );
}

export function ProviderListingEditPage() {
  const { listingId } = useParams({
    from: "/dashboard/listings/$listingId/edit",
  });
  const search = useSearch({ strict: false });
  const itemType = (search as { type?: string }).type;
  const navigate = useNavigate();

  const [addVariantOpen, setAddVariantOpen] = useState(false);

  // Product hooks
  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(
    listingId ?? "",
    { skip: !listingId || itemType !== "PRODUCT" },
  );
  const [updateProduct, { isLoading: updatingProduct }] =
    useUpdateProductMutation();
  const [addProductVariant, { isLoading: addVarLoading }] =
    useAddProductVariantMutation();
  const [removeProductVariant] = useRemoveProductVariantMutation();

  const { data: service, isLoading: serviceLoading } = useGetServiceByIdQuery(
    listingId ?? "",
    { skip: !listingId || itemType !== "SERVICE" },
  );
  const [updateService, { isLoading: updatingService }] =
    useUpdateServiceMutation();

  const isLoading = itemType === "PRODUCT" ? productLoading : serviceLoading;
  const isUpdating = itemType === "PRODUCT" ? updatingProduct : updatingService;
  const item = itemType === "PRODUCT" ? product : service;

  if (
    !listingId ||
    (!itemType && !isLoading) ||
    (item === null && !isLoading)
  ) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Listing not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/dashboard" })}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading || !item) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleUpdateProduct = async (values: Record<string, unknown>) => {
    try {
      const { imageUrls, price, stock, ...rest } = values;
      const sanitizedData = {
        ...rest,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        images: imageUrls as string[],
      };
      await updateProduct({ id: listingId, data: sanitizedData }).unwrap();
      toast.success("Product updated successfully");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    }
  };

  const handleUpdateService = async (values: Record<string, unknown>) => {
    try {
      const { imageUrls, price, discount, ...rest } = values;
      const sanitizedData = {
        ...rest,
        price: price ? Number(price) : undefined,
        discount: discount ? Number(discount) : undefined,
        images: imageUrls as string[],
      };
      await updateService({ id: listingId, data: sanitizedData }).unwrap();
      toast.success("Service updated successfully");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Failed to update service");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-heading font-bold uppercase text-foreground mb-6">
        Edit {itemType === "PRODUCT" ? "Product" : "Service"}
      </h1>

      {itemType === "PRODUCT" && product && (
        <>
          <ProductForm
            initialValues={{
              name: product.name,
              description: product.description ?? "",
              categoryId: product.category?.id ?? "",
              priceType: product.priceType,
              price: String(product.variants?.[0]?.price ?? product.price ?? 0),
              stock: String(product.variants?.[0]?.stock ?? product.stock ?? 0),
              unit: product.variants?.[0]?.unit ?? product.unit ?? "unit",
              imageUrls: product.images ?? [],
            }}
            onSubmit={handleUpdateProduct}
            onCancel={() => navigate({ to: "/dashboard" })}
            isLoading={isUpdating}
          />

          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-lg font-heading font-bold uppercase text-foreground mb-4">
              Variants
            </h2>
            <ul className="space-y-3 mb-4">
              {(product.variants ?? []).map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-sm border border-border bg-card"
                >
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-sm text-muted-foreground">
                      RWF {Number(v.price).toLocaleString()} · Stock: {v.stock}{" "}
                      {v.unit ?? ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={async () => {
                      if (confirm("Remove this variant?")) {
                        try {
                          await removeProductVariant(v.id).unwrap();
                        } catch (e) {
                          console.error(e);
                        }
                      }
                    }}
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddVariantOpen(true)}
              className="gap-2"
            >
              <RiAddLine className="w-4 h-4" />
              Add Variant
            </Button>
          </div>

          <AddVariantDialog
            open={addVariantOpen}
            onClose={() => setAddVariantOpen(false)}
            onSubmit={async (data) => {
              try {
                await addProductVariant({
                  productId: listingId,
                  data,
                }).unwrap();
                setAddVariantOpen(false);
              } catch (e) {
                console.error(e);
              }
            }}
            isLoading={addVarLoading}
          />
        </>
      )}

      {itemType === "SERVICE" && service && (
        <ServiceForm
          initialValues={{
            name: service.name,
            description: service.description ?? "",
            categoryId: service.category?.id ?? "",
            price: String(service.price ?? 0),
            priceType: service.priceType,
            duration: service.duration ?? "",
            discount: String(service.discount ?? 0),
            imageUrls: service.images ?? [],
          }}
          onSubmit={handleUpdateService}
          onCancel={() => navigate({ to: "/dashboard" })}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
