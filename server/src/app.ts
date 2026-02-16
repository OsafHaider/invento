import { env } from "./config/evn.js";
import express, { type Application, type Response } from "express";
import authRouter from "./routes/auth.route.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import { productRouter } from "./routes/product.route.js";
import { stockTransactionRouter } from "./routes/stock-transaction.routes.js";
import { alertRouter } from "./routes/alert.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { globalErrorHandler } from "./middleware/error-handler.js";
export const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/stock", stockTransactionRouter);
app.use("/api/alerts", alertRouter);
app.use("/api/dashboard", dashboardRouter)
app.use(globalErrorHandler)
// Health check endpoint
app.get("/health", (_, res: Response) => {
  res.status(200).json({ status: "ok", message: "Invento server is running" });
});
