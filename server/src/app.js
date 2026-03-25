import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/env.js";
import healthRoutes from "./routes/health.js";
import vehicleRoutes from "./routes/vehicles.js";
import contactRoutes from "./routes/contacts.js";
import tradeInRoutes from "./routes/tradeIns.js";
import hireRoutes from "./routes/hireRequests.js";
import adminRoutes from "./routes/admin.js";
import financingRoutes from "./routes/financing.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOrigin = config.corsOrigin === "*"
  ? true
  : config.corsOrigin.split(",").map((origin) => origin.trim());

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

if (config.storageDriver === "local") {
  const uploadDir = path.resolve(__dirname, "..", config.localUploadDir);
  app.use(config.localPublicBaseUrl, express.static(uploadDir));
}

app.use("/api/health", healthRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/trade-ins", tradeInRoutes);
app.use("/api/hire-requests", hireRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/financing", financingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
