import { Router } from "express";
import { handleGetAlerts, handleMarkAllAsRead, handleMarkAsRead } from "../controllers/alert.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const alertRouter:Router = Router();

alertRouter.get("/",authMiddleware, handleGetAlerts);

alertRouter.patch("/:id/read", handleMarkAsRead);
alertRouter.patch("/read-all", handleMarkAllAsRead);
