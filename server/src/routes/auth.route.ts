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

const authRouter: Router = Router();

authRouter.post("/sign-up", validateBody(registerSchema), signUp);
authRouter.post("/sign-in", validateBody(loginSchema), signIn);
authRouter.get("/profile", authMiddleware, profile);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logout)
export default authRouter;
