import mongoose from "mongoose";
import { env } from "./evn.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/invento");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error);
    process.exit(1);
  }
};
