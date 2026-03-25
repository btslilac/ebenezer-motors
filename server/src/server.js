import app from "./app.js";
import config from "./config/env.js";
import { connectDb } from "./config/db.js";

const startServer = async () => {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
