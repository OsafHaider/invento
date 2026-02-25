"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-product";
import { ProductsTable } from "./product-table";
import { ProductsPagination } from "./product-pagination";

const ProductList = () => {
  const {
    data,
    error,
    isLoading,
    currentPage,
    setCurrentPage,
    deleteLoading,
    deleteProduct,
  } = useProducts();

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading products...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => setCurrentPage(1)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {data?.pagination.total || 0}
          </p>
        </div>

        <Link href="/products/create">
          <Button>Add Product</Button>
        </Link>
      </div>

      {data?.products.length === 0 ? (
        <div className="text-center py-12">No products found</div>
      ) : (
        <>
          <ProductsTable
            products={data?.products || []}
            deleteLoading={deleteLoading}
            onDelete={deleteProduct}
          />

          <ProductsPagination
            pages={data?.pagination.pages || 0}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;