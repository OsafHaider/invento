import CreateProduct from "@/components/modules/product/create-product";

export const metadata = {
  title: "Create Product - Invento",
  description: "Add a new product to your inventory",
};

export default function CreateProductPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <CreateProduct />
      </div>
    </main>
  );
}
