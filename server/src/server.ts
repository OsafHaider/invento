import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
