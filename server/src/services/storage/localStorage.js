import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import config from "../../config/env.js";

export const saveLocalFile = async (file) => {
  const extension = path.extname(file.originalname || "") || ".bin";
  const filename = `${nanoid()}${extension}`;
  const uploadRoot = path.resolve(process.cwd(), config.localUploadDir);
  await fs.mkdir(uploadRoot, { recursive: true });
  const destination = path.join(uploadRoot, filename);
  await fs.writeFile(destination, file.buffer);

  const publicUrl = `${config.localPublicBaseUrl}/${filename}`;
  return { key: filename, url: publicUrl };
};
