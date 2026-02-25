import type { Request, Response, NextFunction } from "express";
import { Product } from "../models/product.js";
import { generateInventorySummary } from "../lib/ai.js";
import { sendResponse } from "../utils/response.js";
import { ApiError } from "../utils/api-error.js";

export const handleGenerateInventorySummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
if(products.length===0){
  throw new ApiError(400,"No products found to generate summary")
}
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

    const cleanedSummary = summary
  .replace(/##\s([^\n]+)/g, "## $1\n")
  .replace(/###\s([^\n]+)/g, "### $1\n");

return sendResponse({
  res,
  statusCode: 200,
  message: "Inventory summary generated successfully",
  data: { summary: cleanedSummary },
});

  } catch(error){
    next(error)
  }
};