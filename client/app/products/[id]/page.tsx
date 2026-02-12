import ProductDetail from "@/components/modules/product/product-detail";

export const metadata = {
  title: "Product Details - Invento",
  description: "View product details",
};

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
    const { id } = await params;
  return (
    <main className="min-h-screen py-12 px-4">
      <ProductDetail productId={id} />
    </main>
  );
}
