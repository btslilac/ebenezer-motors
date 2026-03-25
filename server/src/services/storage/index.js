import config from "../../config/env.js";
import { saveLocalFile } from "./localStorage.js";
import { saveS3File } from "./s3Storage.js";
import { s3Enabled } from "../../config/s3.js";

export const saveFile = async (file) => {
  if (!file) {
    throw new Error("Missing file payload");
  }
  if (config.storageDriver === "s3") {
    if (!s3Enabled) {
      throw new Error("S3 storage selected but not configured");
    }
    return saveS3File(file);
  }
  return saveLocalFile(file);
};
