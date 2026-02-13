"use client";
import React from "react";
import StockTransactionForm from "./stock-transaction-form";
import TransactionHistory from "./transaction-history";
import { Product } from "@/lib/product-api";

interface StockManagementProps {
  product: Product;
  onTransactionSuccess?: () => void;
}

const StockManagement = ({
  product,
  onTransactionSuccess,
}: StockManagementProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Record Transaction</h3>
            <StockTransactionForm
              productId={product._id}
              currentStock={product.quantity}
              onSuccess={onTransactionSuccess}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <TransactionHistory productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
