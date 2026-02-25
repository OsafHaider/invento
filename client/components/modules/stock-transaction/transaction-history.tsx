"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { StockTransaction } from "@/lib/stock-transaction-api";

interface TransactionHistoryProps {
  productId: string;
}

const TransactionHistory = ({ productId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = React.useState<StockTransaction[]>(
    [],
  );
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [pagination, setPagination] = React.useState({
    total: 0,
    pages: 0,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setPage(1);
  }, [productId]);

  React.useEffect(() => {
    fetchTransactionHistory(page);
  }, [page, productId]);

  const fetchTransactionHistory = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      setError("");

      const request = await apiFetch(
        `/api/stock-transactions/${productId}?page=${pageNumber}&limit=${limit}`,
      );

      setTransactions(request.data.transactions);
      setPagination({
        total: request.data.total,
        pages: request.data.pages,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch transaction history.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPage(newPage);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const getTypeStyles = (type: "IN" | "OUT") =>
    type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">
          Track stock movement for this product
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && transactions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No transactions found
        </div>
      )}

      {/* Table */}
      {!isLoading && transactions.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 text-right font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeStyles(
                          transaction.type,
                        )}`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        transaction.type === "IN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "IN" ? "+" : "-"}
                      {transaction.quantity}
                    </td>

                    <td className="px-4 py-3">
                      {transaction.performedBy ? (
                        <div>
                          <p className="font-medium">
                            {transaction.performedBy.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.performedBy.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Unknown
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
                results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </Button>

                <span className="text-sm font-medium">
                  Page {page} of {pagination.pages}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
