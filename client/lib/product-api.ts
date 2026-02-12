import { refreshAccessToken, getTokens, clearTokens } from "./auth-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  sku_code: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  sku_code: string;
}

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  const { accessToken } = getTokens();
  return accessToken;
};

const handleUnauthorized = async () => {
  if (typeof window === "undefined") return;
  
  // Try to refresh token first
  const newToken = await refreshAccessToken();
  if (!newToken) {
    clearTokens();
    window.location.href = "/sign-in";
  }
  return newToken;
};

export const productAPI = {
  async getProducts(page = 1, limit = 10): Promise<ProductsResponse> {
    const token = getAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/api/products?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    console.log(id)
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  async createProduct(
    data: CreateProductInput
  ): Promise<{ message: string }> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create product");
    }

    return response.json();
  },

  async updateProduct(
    id: string,
    data: Partial<CreateProductInput>
  ): Promise<{ message: string; product: Product }> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update product");
    }

    return response.json();
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete product");
    }

    return response.json();
  },
};
