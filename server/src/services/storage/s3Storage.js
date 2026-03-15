import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";
import path from "path";
import config from "../../config/env.js";
import { s3Client } from "../../config/s3.js";

const buildPublicUrl = (key) => {
  if (config.s3.publicBaseUrl) {
    return `${config.s3.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  }
  if (!config.s3.endpoint) {
    return `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${key}`;
  }
  const endpoint = config.s3.endpoint.replace(/\/$/, "");
  return `${endpoint}/${config.s3.bucket}/${key}`;
};

export const saveS3File = async (file) => {
  if (!s3Client) {
    throw new Error("S3 client not configured");
  }
  const extension = path.extname(file.originalname || "") || ".bin";
  const key = `vehicles/${nanoid()}${extension}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: config.s3.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }
  });
  await upload.done();
  return { key, url: buildPublicUrl(key) };
};
