import { Router } from "express";
import { handleGenerateInventorySummary } from "../controllers/dashboard.controller.js";

export const dashboardRouter:Router = Router();

dashboardRouter.get("/ai-summary", handleGenerateInventorySummary);

