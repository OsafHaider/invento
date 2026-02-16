"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/modules/product/product-form";
import { productAPI, Product } from "@/lib/product-api";
import { apiFetch } from "@/lib/fetch-api-wrapper";

interface EditProductProps {
  productId: string;
}

const EditProduct = ({ productId }: EditProductProps) => {
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
     const req=await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);
     const res=await req.json();
     console.log(res)
      const data = res.data;
      setProduct(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">{error}</p>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Product not found</p>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/products"
          className="text-primary hover:underline text-sm"
        >
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-4">
          Edit Product
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update product information
        </p>
      </div>
      <ProductForm
        initialData={product}
        onSuccess={() => router.push("/products")}
      />
    </div>
  );
};

export default EditProduct;
