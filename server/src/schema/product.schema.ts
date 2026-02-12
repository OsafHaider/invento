import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL").optional(),
  sku_code: z.string().min(1, "SKU code is required"),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
