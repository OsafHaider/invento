import ProductList from "@/components/modules/product/product-list";

export const metadata = {
  title: "Products - Invento",
  description: "Manage your products",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <ProductList />
      </div>
    </main>
  );
}
