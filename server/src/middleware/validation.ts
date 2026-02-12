import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        res.status(400).json({ error: "Validation failed", details: formattedErrors });
        return;
      }
      next(error);
    }
  };
}

