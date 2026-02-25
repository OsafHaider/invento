"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-input";
import { Product } from "@/lib/product-api";
import { toast } from "sonner";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { fi } from "zod/locales";
interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
}

const productSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().trim(),
  price: z.number().positive(),
  category: z.string().min(1).trim(),
  sku_code: z.string().min(1).trim(),
  image: z.string().url().optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [aiLoading, setAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

  // ---------------- AI GENERATE FUNCTION ----------------
  const handleGenerateDescription = async () => {
    const name = getValues("name");
    const category = getValues("category");

    if (!name || !category) {
      toast.error("Enter product name and category first");
      return;
    }
    setAiLoading(true);
    try {
      const request = await apiFetch("/api/products/ai-description", {
        method: "POST",
        body: JSON.stringify({ name, category }),
      });
      if (request.success) {
        setValue("description", request.data.description, {
          shouldValidate: true,
        });
        toast.success("AI description generated");
      } else {
        toast.error("Failed to generate description");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    finally {
      setAiLoading(false);
    }
  };

  // ---------------- SUBMIT ----------------
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };
      const request = initialData
        ? await apiFetch(`/api/products/${initialData._id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch("/api/products", {
            method: "POST",
            body: JSON.stringify(payload),
          });
      if (request.success) {
        toast.success(
          initialData
            ? "Product updated successfully"
            : "Product created successfully",
        );
        reset();
        onSuccess?.();
      } else {
        toast.error(request.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-2xl"
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Product Name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Category"
          type="text"
          {...register("category")}
          error={errors.category?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="SKU Code"
          type="text"
          {...register("sku_code")}
          error={errors.sku_code?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
          disabled={isSubmitting}
        />

        <FormInput
          label="Image URL (Optional)"
          type="text"
          {...register("image")}
          error={errors.image?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* DESCRIPTION + AI BUTTON */}
      <div>
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Description</label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-white"
            onClick={handleGenerateDescription}
            disabled={aiLoading || isSubmitting}
          >
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />

            {aiLoading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>

        <textarea
          rows={4}
          className="w-full px-3 py-2 mt-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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
