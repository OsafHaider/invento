"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { productAPI, Product, ProductsResponse } from "@/lib/product-api";

const ProductList = () => {
  const [data, setData] = React.useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteLoading, setDeleteLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await productAPI.getProducts(page, 10);
      setData(response);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await productAPI.deleteProduct(id);
      await fetchProducts(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => fetchProducts(1)} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {data?.pagination.total || 0} products
          </p>
        </div>
        <Link href="/products/create">
          <Button variant="default">Add Product</Button>
        </Link>
      </div>

      {error && !isLoading && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      {data?.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
          <Link href="/products/create">
            <Button variant="outline" className="mt-4">
              Create your first product
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    SKU Code
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Category
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product) => (
                  <tr key={product._id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {product.sku_code}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2 justify-center">
                        <Link href={`/products/${product._id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Link href={`/products/${product._id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteLoading === product._id}
                        >
                          {deleteLoading === product._id ? "..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: data.pagination.pages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={
                      currentPage === i + 1 ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(data.pagination.pages, p + 1)
                  )
                }
                disabled={currentPage === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
