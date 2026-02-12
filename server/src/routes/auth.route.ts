import { Router } from "express";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../schema/auth.schema.js";
import { validateBody } from "../middleware/validation.js";
import {
  refreshToken,
  signIn,
  signUp,
  profile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const authRouter: Router = Router();

authRouter.post("/sign-up", validateBody(registerSchema), signUp);
authRouter.post("/sign-in", validateBody(loginSchema), signIn);
authRouter.post("/refresh", validateBody(refreshTokenSchema), refreshToken);
authRouter.get("/profile", authMiddleware, profile);

export default authRouter;
