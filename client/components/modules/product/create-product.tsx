"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/modules/product/product-form";

const CreateProduct = () => {
  const router = useRouter();

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
          Create New Product
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new product to your inventory
        </p>
      </div>
      <ProductForm onSuccess={() => router.push("/products")} />
    </div>
  );
};

export default CreateProduct;
