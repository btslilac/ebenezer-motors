import dotenv from "dotenv";

// Only load .env file when running locally — Vercel injects env vars from the dashboard
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminRegistrationKey: process.env.ADMIN_REGISTRATION_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  storageDriver: process.env.STORAGE_DRIVER || "s3",
  localUploadDir: process.env.LOCAL_UPLOAD_DIR || "uploads",
  localPublicBaseUrl: process.env.LOCAL_PUBLIC_BASE_URL || "/uploads",
  s3: {
    region: process.env.S3_REGION || "us-east-1",
    bucket: process.env.S3_BUCKET || "",
    endpoint: process.env.S3_ENDPOINT || "",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL || "",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true"
  }
};

if (!config.mongoUri) {
  console.warn("MONGODB_URI is not set. Server will fail to connect.");
}
if (!config.jwtSecret) {
  console.warn("JWT_SECRET is not set. Admin auth will fail.");
}

export default config;
