import { refreshAccessToken, getTokens, clearTokens } from "./auth-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface StockTransaction {
  _id: string;
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  performedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistory {
  transactions: StockTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateTransactionInput {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
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

export const stockTransactionAPI = {
  async createTransaction(
    data: CreateTransactionInput,
  ): Promise<{ message: string; transaction: StockTransaction }> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/stock`, {
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create stock transaction");
    }

    return response.json();
  },

  async getTransactionHistory(
    productId: string,
    page = 1,
    limit = 10,
  ): Promise<TransactionHistory> {
    const token = getAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/api/stock/${productId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      },
    );

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch transaction history");
    }

    return response.json();
  },
};
