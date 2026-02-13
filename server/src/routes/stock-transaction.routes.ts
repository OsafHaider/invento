import { Router } from "express";
import {
  handleCreateStockTransaction,
  handleGetTransactionHistory,
} from "../controllers/stock-transaction.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { createStockTransactionSchema } from "../schema/stock-transaction.schema.js";

export const stockTransactionRouter: Router = Router();

stockTransactionRouter.post(
  "/",
  authMiddleware,
  validateBody(createStockTransactionSchema),
  handleCreateStockTransaction,
);
stockTransactionRouter.get("/:id", authMiddleware, handleGetTransactionHistory);
