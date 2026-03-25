import { S3Client } from "@aws-sdk/client-s3";
import config from "./env.js";

const s3Enabled = Boolean(
  config.s3.bucket && config.s3.accessKeyId && config.s3.secretAccessKey
);

let s3Client = null;

if (s3Enabled) {
  s3Client = new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint || undefined,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey
    },
    forcePathStyle: config.s3.forcePathStyle
  });
}

export { s3Client, s3Enabled };
