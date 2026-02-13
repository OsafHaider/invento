import { z } from "zod";

export const createStockTransactionSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  type: z.enum(["IN", "OUT"], {
    message: "Type must be either 'IN' or 'OUT'",
  }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type CreateStockTransactionInput = z.infer<
  typeof createStockTransactionSchema
>;
