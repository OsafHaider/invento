import { Router } from "express";
import { handleGenerateInventorySummary } from "../controllers/dashboard.controller.js";
import { rateLimiterUserId } from "../middleware/rate-limiter/user-id.js";
import { authMiddleware } from "../middleware/auth.js";

export const dashboardRouter:Router = Router();

dashboardRouter.get("/ai-summary", authMiddleware,rateLimiterUserId, handleGenerateInventorySummary);

