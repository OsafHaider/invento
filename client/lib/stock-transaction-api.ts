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
  data:{
transactions: StockTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }
}

export interface CreateTransactionInput {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
}


