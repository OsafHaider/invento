import { env } from "./config/evn.js";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initRedis } from "./lib/redis.js";

const PORT = env.PORT;
const startServer = async () => {
  try {
    // Database Connection
    await connectDB();
    // Redis Connection
    await initRedis();
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
