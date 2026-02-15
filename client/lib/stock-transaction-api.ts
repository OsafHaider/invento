// lib/stock-transaction-api.ts

import { apiFetch } from "./fetch-api-wrapper";

const BACKEND_URL="http://localhost:8080"
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

// ✅ simple reusable response handler
async function handleResponse<T>(res: Response | undefined): Promise<T> {
  if (!res) throw new Error("No response from server");

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export const stockTransactionAPI = {
  async createTransaction(
    payload: CreateTransactionInput
  ): Promise<{ message: string; transaction: StockTransaction }> {
    const res = await apiFetch(`${BACKEND_URL}/api/stock`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  async getTransactionHistory(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionHistory> {
    const res = await apiFetch(
      `${BACKEND_URL}/api/stock/${productId}?page=${page}&limit=${limit}`
    );

    return handleResponse(res);
  },
};
