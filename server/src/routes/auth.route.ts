import { Router } from "express";
import {
  registerSchema,
  loginSchema,
} from "../schema/auth.schema.js";
import { validateBody } from "../middleware/validation.js";
import {
  signIn,
  signUp,
  profile,
  logout,
  refreshTokenController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { rateLimiterIP } from "../middleware/rate-limiter/ip.js";
import { rateLimiterUserId } from "../middleware/rate-limiter/user-id.js";

const authRouter: Router = Router();

authRouter.post("/sign-up", rateLimiterIP ,validateBody(registerSchema), signUp);
authRouter.post("/sign-in", rateLimiterIP,validateBody(loginSchema), signIn);
authRouter.get("/profile",  authMiddleware,rateLimiterUserId, profile);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logout)
export default authRouter;
