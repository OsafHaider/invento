"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {  Product } from "@/lib/product-api";
import { StockManagement } from "@/components/modules/stock-transaction";
import { apiFetch } from "@/lib/api";

interface ProductDetailProps {

  productId: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const request = await apiFetch(`/api/products/${productId}`);
          if (request.success) {
            setProduct(request.data);
            setError("");
          } else {
            setError(request.message || "Failed to fetch product");
          }
        } catch (error) {
          setError("Failed to fetch product");
        } finally {
          setIsLoading(false);
        }
      };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Link href="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Link href="/products" className="text-primary hover:underline text-sm">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Image */}
        <div className="md:col-span-1">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg border flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              SKU: <span className="font-mono">{product.sku_code}</span>
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Price:
              </span>
              <span className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Quantity:
              </span>
              <span className="text-lg font-semibold">
                {product.quantity} {product.quantity === 1 ? "unit" : "units"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Category:
              </span>
              <span className="text-lg font-semibold">{product.category}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-foreground">
              {product.description}
            </p>
          </div>

          <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
            <div>
              Created:{" "}
              {new Date(product.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div>
              Last Updated:{" "}
              {new Date(product.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/products/${product._id}/edit`} className="flex-1">
              <Button variant="default" className="w-full">
                Edit Product
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stock Management Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Stock Management</h2>
        <StockManagement
          product={product}
          onTransactionSuccess={() => {
            fetchProduct();
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
