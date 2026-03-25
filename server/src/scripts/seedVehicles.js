import "dotenv/config";
import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";
import { vehicles as seedVehicles } from "../../../src/data/vehicles.js";
import config from "../config/env.js";

const run = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }
  await mongoose.connect(config.mongoUri);
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(seedVehicles);
  console.log(`Seeded ${seedVehicles.length} vehicles`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
