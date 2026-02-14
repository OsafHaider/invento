"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-input";
import { productAPI, Product } from "@/lib/product-api";
import { toast } from "sonner";
import axios from "axios";

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
}

// ---------------- Schema ----------------
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .trim(),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  category: z.string().min(1, "Category is required").trim(),

  sku_code: z.string().min(1, "SKU code is required").trim(),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({
  initialData,
  onSuccess,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      category: initialData?.category ?? "",
      image: initialData?.image ?? "",
      sku_code: initialData?.sku_code ?? "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (initialData) {
        await productAPI.updateProduct(initialData.id, data);
        toast.success("Product updated successfully");
      }
        else {
          await productAPI.createProduct(data);
          toast.success("Product created successfully");
          reset(); // clean reset instead of manual state juggling
        }
      onSuccess?.();
    } catch (error) {
      
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-2xl"
      noValidate
    >
      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          aria-invalid={!!errors.name}
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Category"
          type="text"
          placeholder="e.g., Electronics"
          aria-invalid={!!errors.category}
          {...register("category")}
          error={errors.category?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="SKU Code"
          type="text"
          placeholder="e.g., SKU-001"
          aria-invalid={!!errors.sku_code}
          {...register("sku_code")}
          error={errors.sku_code?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Price"
          type="number"
          step="0.01"
          aria-invalid={!!errors.price}
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Image URL (Optional)"
          type="text"
          placeholder="https://example.com/image.jpg"
          aria-invalid={!!errors.image}
          {...register("image")}
          error={errors.image?.message}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-invalid={!!errors.description}
          {...register("description")}
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className="text-xs text-destructive">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
