import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/product-api";

interface Props {
  products: Product[];
  deleteLoading: string | null;
  onDelete: (id: string) => void;
}

export const ProductsTable = ({
  products,
  deleteLoading,
  onDelete,
}: Props) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">SKU</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-right">Price</th>
            <th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t">
              <td className="px-4 py-3">{product.name}</td>
              <td className="px-4 py-3 font-mono">{product.sku_code}</td>
              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3 text-right">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">{product.quantity}</td>
              <td className="px-4 py-3 text-center">
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
                    onClick={() => onDelete(product._id)}
                    disabled={deleteLoading === product._id}
                  >
                    {deleteLoading === product._id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};