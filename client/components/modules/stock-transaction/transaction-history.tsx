"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  stockTransactionAPI,
  StockTransaction,
} from "@/lib/stock-transaction-api";

interface TransactionHistoryProps {
  productId: string;
}

const TransactionHistory = ({ productId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = React.useState<StockTransaction[]>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetchTransactionHistory();
  }, [productId, pagination.page]);

  const fetchTransactionHistory = async () => {
    try {
      setIsLoading(true);
      const response = await stockTransactionAPI.getTransactionHistory(
        productId,
        pagination.page,
        pagination.limit,
      );
      setTransactions(response.transactions);
      setPagination(response.pagination);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: "IN" | "OUT") => {
    return type === "IN" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  const getTypeBadgeColor = (type: "IN" | "OUT") => {
    return type === "IN"
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                Date & Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                Performed By
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(transaction.type)}`}
                  >
                    {transaction.type === "IN" ? "Stock In" : "Stock Out"}
                  </span>
                </td>
                <td className={`border border-gray-300 px-4 py-2 text-sm text-right font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === "IN" ? "+" : "-"}
                  {transaction.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {transaction.performedBy ? (
                    <div>
                      <p className="font-medium">{transaction.performedBy.name}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.performedBy.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} transactions
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      pagination.page === page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
