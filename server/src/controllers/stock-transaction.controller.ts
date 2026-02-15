import type { Request, Response } from "express";
import { StockTransaction } from "../models/stock-transaction.js";
import { Product } from "../models/product.js";
import mongoose from "mongoose";

/* ================= CREATE TRANSACTION ================= */
export const handleCreateStockTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, type } = req.body;
    const quantity = Number(req.body.quantity);

    /* ================= VALIDATION ================= */

    if (!productId || !type || !quantity) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (!["IN", "OUT"].includes(type)) {
      res.status(400).json({ error: "Invalid transaction type" });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ error: "Quantity must be greater than 0" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    /* ================= FIND PRODUCT ================= */

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    /* ================= STOCK CHECK ================= */

    if (type === "OUT" && product.quantity < quantity) {
      res.status(400).json({
        error: "Insufficient stock",
        available: product.quantity,
      });
      return;
    }

    /* ================= UPDATE STOCK ================= */

    const quantityChange = type === "IN" ? quantity : -quantity;
    product.quantity += quantityChange;
    await product.save();

    /* ================= CREATE TRANSACTION ================= */

    const performedBy = (req as any).user?.id;

    const transaction = await StockTransaction.create({
      productId,
      type,
      quantity,
      performedBy,
    });

    res.status(201).json({
      message: "Stock transaction created successfully",
      transaction,
    });

  } catch (error) {
    console.error("Create stock transaction error:", error);
    res.status(500).json({ error: "Failed to create stock transaction" });
  }
};

/* ================= GET TRANSACTION HISTORY ================= */
export const handleGetTransactionHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
  res.status(400).json({ error: "Product id is required" });
  return;
}
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
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

    res.status(200).json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({ error: "Failed to fetch transaction history" });
  }
};
