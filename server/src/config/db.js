import mongoose from "mongoose";
import config from "./env.js";

export const connectDb = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
};
