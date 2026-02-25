import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../../utils/api-error.js";
import { getRedis } from "../../lib/redis.js";

const MAXTOKENS = 5
const WINDOW_SECONDS = 60

export const rateLimiterIP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const redis = getRedis();
    const userIP = req.ip as string
    if (!userIP) {
      throw new ApiError(404, "User not found");
    }

    const key = `rate_limit:${userIP}`
    // Increment request count
    const currentCount = await redis.incr(key)
    // If first request, set expiry
    if (currentCount === 1) {
      await redis.expire(key, WINDOW_SECONDS)
    }

    // Block if limit exceeded
    if (currentCount > MAXTOKENS) {
      return res.status(429).json({
        error: "Too many requests, please try again later"
      })
    }

    next()
  } catch (error) {
   next(error)
  }
}