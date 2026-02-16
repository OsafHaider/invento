import type { NextFunction, Request, Response } from "express";
import { StockTransaction } from "../models/stock-transaction.js";
import { Product } from "../models/product.js";
import mongoose from "mongoose";
import { Alert } from "../models/alert.js";
import { ApiError } from "../utils/api-error.js";
import { sendResponse } from "../utils/response.js";

interface Transaction{
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  performedBy: string;
}

interface Alert{
  alertID: string | string[] | undefined;
}
export const handleCreateStockTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, type, quantity } = req.body;

    /* ===== VALIDATION ===== */

    if (!productId || !type || !quantity) {
      throw new ApiError(400, "All fields are required");
    }

    if (!["IN", "OUT"].includes(type)) {
      throw new ApiError(400, "Invalid transaction type");
    }

    if (isNaN(quantity) || Number(quantity) <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product id");
    }

    /* ===== FETCH PRODUCT ===== */

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const qty = Number(quantity);

    if (type === "OUT" && product.quantity < qty) {
      throw new ApiError(
        400,
        `Insufficient stock. Available: ${product.quantity}`
      );
    }

    /* ===== UPDATE STOCK ===== */

    const previousQuantity = product.quantity;

    if (type === "IN") {
      product.quantity += qty;
    } else {
      product.quantity -= qty;
    }

    await product.save();

    /* ===== LOW STOCK ALERT ===== */

    if (
      previousQuantity > product.lowStockThreshold &&
      product.quantity <= product.lowStockThreshold
    ) {
      await Alert.create({
        productId: product._id,
        message: `${product.name} stock is low. Only ${product.quantity} left.`,
        type: "LOW_STOCK",
        isRead: false,
      });
    }

    /* ===== CREATE TRANSACTION ===== */

    const performedBy = req.user?.id!;
    if (!mongoose.Types.ObjectId.isValid(performedBy)) {
      throw new ApiError(400, "Invalid user id");
    }

const createTransaction:Transaction={
  productId,
  type,
  quantity: qty,
  performedBy
}
    const transaction = await StockTransaction.create(createTransaction);

    sendResponse({
      res,
      statusCode: 201,
      data: transaction,
      message: "Stock transaction created successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const handleGetTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Product id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
  throw new ApiError(400, "Invalid product id");
}

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const filter = { productId: id };

    const [transactions, total] = await Promise.all([
      StockTransaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .populate("performedBy", "name email"),
      StockTransaction.countDocuments(filter),
    ]);

    sendResponse({
      res,
      statusCode: 200,
      data: {
        transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      message: "Transaction history fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

