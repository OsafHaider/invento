import React from "react";
import { apiFetch } from "@/lib/api";
import { ProductsResponse } from "@/lib/product-api";

export const useProducts = () => {
  const [data, setData] = React.useState<ProductsResponse | null>(null);
  const [error, setError] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteLoading, setDeleteLoading] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await apiFetch(`/api/products?page=${page}&limit=10`);
      setData(res.data);
      setError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setDeleteLoading(id);
      await apiFetch(`/api/products/${id}`, { method: "DELETE" });

      if (data && data.products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchProducts(currentPage);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred";

      setError(message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return {
    data,
    error,
    isLoading,
    currentPage,
    setCurrentPage,
    deleteLoading,
    deleteProduct,
  };
};
