import { Router } from "express";
import {
  handleCreateProduct,
  handleGetProduct,
  getProductByID,
  updateProductByID,
  deleteProductByID,
  handleGenerateDescription,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schema.js";
import { rateLimiterUserId } from "../middleware/rate-limiter/user-id.js";

export const productRouter: Router = Router();

productRouter.post("/", authMiddleware, rateLimiterUserId,validateBody(createProductSchema), handleCreateProduct);
productRouter.get("/", authMiddleware, rateLimiterUserId, handleGetProduct);
productRouter.get("/:id", authMiddleware, rateLimiterUserId, getProductByID);
productRouter.put("/:id", authMiddleware, rateLimiterUserId,validateBody(updateProductSchema), updateProductByID);
productRouter.delete("/:id", authMiddleware, rateLimiterUserId,deleteProductByID);
productRouter.post("/ai-description", authMiddleware, rateLimiterUserId, handleGenerateDescription);