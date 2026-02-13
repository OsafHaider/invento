"use client";
import React from "react";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import {
  stockTransactionAPI,
  CreateTransactionInput,
  StockTransaction,
} from "@/lib/stock-transaction-api";

interface StockTransactionFormProps {
  productId: string;
  currentStock: number;
  onSuccess?: (transaction: StockTransaction) => void;
}

const StockTransactionForm = ({
  productId,
  currentStock,
  onSuccess,
}: StockTransactionFormProps) => {
  const [formData, setFormData] = React.useState<CreateTransactionInput>({
    productId,
    type: "IN",
    quantity: 0,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.type === "OUT" && formData.quantity > currentStock) {
      newErrors.quantity = `Insufficient stock. Available: ${currentStock}`;
    }

    if (!formData.type) {
      newErrors.type = "Transaction type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await stockTransactionAPI.createTransaction({
        productId: formData.productId,
        type: formData.type,
        quantity: Math.round(formData.quantity),
      });

      setSuccessMessage("Stock transaction created successfully!");
      setFormData({
        productId,
        type: "IN",
        quantity: 0,
      });
      setErrors({});

      if (onSuccess) {
        onSuccess(result.transaction);
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Current Stock: <span className="font-bold">{currentStock}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Transaction Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="IN">Stock In (Add Stock)</option>
          <option value="OUT">Stock Out (Remove Stock)</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type}</p>
        )}
      </div>

      <FormInput
        type="number"
        name="quantity"
        label="Quantity"
        placeholder="Enter quantity"
        value={formData.quantity.toString()}
        onChange={handleChange}
        error={errors.quantity}
        required
      />

      {formData.type === "OUT" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            You are about to remove{" "}
            <span className="font-bold">{formData.quantity}</span> units. New
            stock will be:{" "}
            <span className="font-bold">
              {currentStock - formData.quantity}
            </span>
          </p>
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{apiError}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Processing..." : "Record Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default StockTransactionForm;
