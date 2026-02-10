import express, { type Application, type Response } from "express";
export const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_, res: Response) => {
  res.status(200).json({ status: "ok", message: "Invento server is running" });
});
