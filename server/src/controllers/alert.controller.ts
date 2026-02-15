import type { Request, Response } from "express";
import { Alert } from "../models/alert.js";

export const handleGetAlerts = async (
  req: Request,
  res: Response
) => {
  try {
    const alerts = await Alert.find({ isRead: false })
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ alerts });
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};
