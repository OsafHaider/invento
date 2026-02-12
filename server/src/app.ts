import express, { type Application, type Response } from "express";
import authRouter from "./routes/auth.route.js";
import cookieparser from "cookie-parser";
export const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
// Routes
app.use("/api/auth", authRouter);

// Health check endpoint
app.get("/health", (_, res: Response) => {
  res.status(200).json({ status: "ok", message: "Invento server is running" });
});
