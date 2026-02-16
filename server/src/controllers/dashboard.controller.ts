import type { Request, Response } from "express";
import { Product } from "../models/product.js";
import { generateInventorySummary } from "../lib/ai.js";

export const handleGenerateInventorySummary = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    const dataForAI = {
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts.map((p) => ({
        name: p.name,
        quantity: p.quantity,
      })),
    };

    const summary = await generateInventorySummary(dataForAI);

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
