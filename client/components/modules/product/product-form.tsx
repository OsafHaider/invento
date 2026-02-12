"use client";
import React from "react";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { productAPI, CreateProductInput, Product } from "@/lib/product-api";

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = React.useState<CreateProductInput>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    category: initialData?.category || "",
    image: initialData?.image || "",
    sku_code: initialData?.sku_code || "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Product name must not exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.sku_code.trim()) {
      newErrors.sku_code = "SKU code is required";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Image must be a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "price" || name === "quantity" ? parseFloat(value) : value;

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
      if (initialData) {
        await productAPI.updateProduct(initialData._id, formData);
        setSuccessMessage("Product updated successfully!");
      } else {
        await productAPI.createProduct(formData);
        setSuccessMessage("Product created successfully!");
        setFormData({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          category: "",
          image: "",
          sku_code: "",
        });
      }

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Product Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          error={errors.name}
          disabled={isLoading}
        />

        <FormInput
          label="Category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Electronics"
          error={errors.category}
          disabled={isLoading}
        />

        <FormInput
          label="SKU Code"
          type="text"
          name="sku_code"
          value={formData.sku_code}
          onChange={handleChange}
          placeholder="e.g., SKU-001"
          error={errors.sku_code}
          disabled={isLoading}
        />

        <FormInput
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.price}
          disabled={isLoading}
          step="0.01"
        />

        <FormInput
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="0"
          error={errors.quantity}
          disabled={isLoading}
        />

        <FormInput
          label="Image URL (Optional)"
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          error={errors.image}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          disabled={isLoading}
          className="w-full px-3 py-2 mt-1 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 border-input focus:border-primary"
          rows={4}
        />
        {errors.description && (
          <span className="text-xs text-destructive">{errors.description}</span>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
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
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
