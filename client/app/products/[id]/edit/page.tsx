import EditProduct from "@/components/modules/product/edit-product";

export const metadata = {
  title: "Edit Product - Invento",
  description: "Edit product details",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <EditProduct productId={id} />
      </div>
    </main>
  );
}
