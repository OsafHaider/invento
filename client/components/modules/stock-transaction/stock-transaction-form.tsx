"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-input";
import { StockTransaction } from "@/lib/stock-transaction-api";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface StockTransactionFormProps {
  productId: string;
  currentStock: number;
  onSuccess?: (transaction: StockTransaction) => void;
}
export default function StockTransactionForm({
  productId,
  currentStock,
  onSuccess,
}: StockTransactionFormProps) {
  // ---------------- Schema ----------------
  const schema = z
    .object({
      type: z.enum(["IN", "OUT"], {
        message: "Transaction type is required or invalid",
      }),
      quantity: z
        .number({ message: "Quantity must be a number" })
        .int("Quantity must be a whole number")
        .positive("Quantity must be greater than 0"),
    })
    .refine((data) => data.type === "IN" || data.quantity <= currentStock, {
      message: `Insufficient stock. Available: ${currentStock}`,
      path: ["quantity"],
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "IN",
      quantity: 0,
    },
  });

  const type = useWatch({ control, name: "type" });
  const quantity = useWatch({ control, name: "quantity" }) ?? 0;

  const onSubmit = async (data: FormValues) => {
    try {
      const request = await apiFetch("/api/stock-transactions", {
        method: "POST",
        body: JSON.stringify({
          productId,
          type: data.type,
          quantity: data.quantity,
        }),
      });
      if (request.success) {
        toast.success("Transaction recorded successfully");
        reset();
        if (onSuccess) {
          onSuccess(request.data);
        }
      } else {
        toast.error(request.message || "Failed to record transaction");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to record transaction.";

      setError("root", { message });
      toast.error(message);
    }
  };

  const projectedStock =
    type === "OUT" ? currentStock - quantity : currentStock + quantity;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Current Stock: <span className="font-bold">{currentStock}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Transaction Type
        </label>
        <select
          {...register("type")}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="IN">Stock In (Add Stock)</option>
          <option value="OUT">Stock Out (Remove Stock)</option>
        </select>
        {errors.type && (
          <p className="text-xs text-destructive mt-1">{errors.type.message}</p>
        )}
      </div>

      <FormInput
        type="number"
        label="Quantity"
        placeholder="Enter quantity"
        aria-invalid={!!errors.quantity}
        {...register("quantity", { valueAsNumber: true })}
        error={errors.quantity?.message}
        disabled={isSubmitting}
      />

      {type === "OUT" && quantity > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            You are removing <span className="font-bold">{quantity}</span>{" "}
            units. New stock will be{" "}
            <span className="font-bold">{projectedStock}</span>
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Processing..." : "Record Transaction"}
      </Button>
    </form>
  );
}
