const Minio = require("minio");

const DIVA_LAKE_HOST = process.env.DIVA_LAKE_HOST || "localhost";
const DIVA_LAKE_PORT = parseInt(process.env.DIVA_LAKE_PORT, 10) || 9000;
const DIVA_LAKE_USERNAME = process.env.DIVA_LAKE_USERNAME || "minio_access";
const DIVA_LAKE_PASSWORD = process.env.DIVA_LAKE_PASSWORD || "minio_secret";
const BUCKET_NAME = process.env.DIVA_LAKE_BUCKET_NAME || "file-lake";

const minioClient = new Minio.Client({
  endPoint: DIVA_LAKE_HOST,
  port: DIVA_LAKE_PORT,
  useSSL: false,
  accessKey: DIVA_LAKE_USERNAME,
  secretKey: DIVA_LAKE_PASSWORD,
});

const uploadObject = async (hash, fileBuffer) =>
  minioClient.putObject(BUCKET_NAME, hash, fileBuffer);

const removeObject = async (hash) =>
  minioClient.removeObject(BUCKET_NAME, hash);

const removeObjects = async (hash) =>
  minioClient.removeObjects(BUCKET_NAME, hash);

module.exports = {
  minioClient,
  uploadObject,
  removeObject,
  removeObjects,
  DIVA_LAKE_HOST,
  DIVA_LAKE_USERNAME,
  DIVA_LAKE_PORT,
  DIVA_LAKE_PASSWORD,
};
