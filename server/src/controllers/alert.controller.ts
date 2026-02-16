import type { Request, Response, NextFunction } from "express";
import { Alert } from "../models/alert.js";
import { ApiError } from "../utils/api-error.js";
import { sendResponse } from "../utils/response.js";

/* ===== GET ALERTS ===== */
export const handleGetAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alerts = await Alert.find({ isRead: false })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    sendResponse({
      res,
      statusCode: 200,
      data: alerts,
      message: "Alerts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===== MARK SINGLE AS READ ===== */
export const handleMarkAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Alert id is required");
    }

    const alert = await Alert.findByIdAndUpdate(id, { isRead: true });

    if (!alert) {
      throw new ApiError(404, "Alert not found");
    }

    sendResponse({
      res,
      statusCode: 200,
      data: null,
      message: "Alert marked as read",
    });
  } catch (error) {
    next(error);
  }
};

/* ===== MARK ALL AS READ ===== */
export const handleMarkAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Alert.updateMany({ isRead: false }, { isRead: true });

    sendResponse({
      res,
      statusCode: 200,
      data: null,
      message: "All alerts marked as read",
    });
  } catch (error) {
    next(error);
  }
};
