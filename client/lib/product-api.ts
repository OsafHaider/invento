import { apiFetch } from "./fetch-api-wrapper";



const BACKEND_URL="http://localhost:8080"
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  sku_code: string;
  createdBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  sku_code: string;
}

// ✅ simple reusable response handler
async function handleResponse<T>(res: Response | undefined): Promise<T> {
  if (!res) throw new Error("No response from server");

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export const productAPI = {
  async getProducts(page = 1, limit = 10): Promise<ProductsResponse> {
    const res = await apiFetch(
      `http://localhost:8080/api/products?page=1&limit=10`
    );
    return handleResponse<ProductsResponse>(res);
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    const res = await apiFetch(`${BACKEND_URL}/products/${id}`);
    return handleResponse<{ product: Product }>(res);
  },

  async createProduct(
    data: CreateProductInput
  ): Promise<{ message: string }> {
    const res = await apiFetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(res);
  },

  async updateProduct(
    id: string,
    data: Partial<CreateProductInput>
  ): Promise<{ message: string; product: Product }> {
    const res = await apiFetch(`${BACKEND_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; product: Product }>(res);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await apiFetch(`${BACKEND_URL}/products/${id}`, {
      method: "DELETE",
    });
    return handleResponse<{ message: string }>(res);
  },
};
