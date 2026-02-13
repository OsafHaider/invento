import type { Request, Response } from "express";
import { StockTransaction } from "../models/stock-transaction.js";
import { Product } from "../models/product.js";

export const handleCreateStockTransaction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { productId, type, quantity } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Check if quantity is available for OUT transactions
    if (type === "OUT" && product.quantity < quantity) {
      res.status(400).json({
        error: "Insufficient stock",
        available: product.quantity,
        requested: quantity,
      });
      return;
    }

    // Create stock transaction
    const newTransaction = new StockTransaction({
      productId,
      type,
      quantity,
      performedBy: (req as any).user.id,
    });

    await newTransaction.save();

    // Update product quantity
    if (type === "IN") {
      product.quantity += quantity;
    } else {
      product.quantity -= quantity;
    }
    await product.save();

    res.status(201).json({
      message: "Stock transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Create stock transaction error:", error);
    res.status(500).json({ error: "Failed to create stock transaction" });
  }
};

export const handleGetTransactionHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Verify product exists
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const transactions = await StockTransaction.find({ productId: id })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    const total = await StockTransaction.countDocuments({ productId: id });

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
