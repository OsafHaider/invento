import { Router } from "express";
import { handleGetAlerts } from "../controllers/alert.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const alertRouter:Router = Router();

alertRouter.get("/",authMiddleware, handleGetAlerts);

