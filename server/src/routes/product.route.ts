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

export const productRouter: Router = Router();

productRouter.post("/", authMiddleware, validateBody(createProductSchema), handleCreateProduct);
productRouter.get("/", authMiddleware, handleGetProduct);
productRouter.get("/:id", authMiddleware, getProductByID);
productRouter.put("/:id", authMiddleware, validateBody(updateProductSchema), updateProductByID);
productRouter.delete("/:id", authMiddleware, deleteProductByID);
productRouter.post("/ai-description", authMiddleware, handleGenerateDescription);