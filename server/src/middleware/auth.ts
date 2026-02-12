import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";
import { verifyAccessToken } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
