const axios = require("axios");
const path = require("path");
const urljoin = require("url-join");
const hasha = require("hasha");
const { lookup } = require("mime-types");
const FileType = require("file-type");
const Minio = require("minio");

const DIVA_LAKE_HOST = process.env.DIVA_LAKE_HOST || "localhost";
const DIVA_LAKE_PORT = parseInt(process.env.DIVA_LAKE_PORT, 10) || 9000;
const DIVA_LAKE_USERNAME = process.env.DIVA_LAKE_USERNAME || "minio_access";
const DIVA_LAKE_PASSWORD = process.env.DIVA_LAKE_PASSWORD || "minio_secret";
const BUCKET_NAME = process.env.DIVA_LAKE_BUCKET_NAME || "file-lake";

const RESOURCE_MANAGEMENT_URL = urljoin(
  process.env.RESOURCE_MANAGEMENT_URL || "http://localhost:3000",
  "resources"
);

const minioClient = new Minio.Client({
  endPoint: DIVA_LAKE_HOST,
  port: DIVA_LAKE_PORT,
  useSSL: false,
  accessKey: DIVA_LAKE_USERNAME,
  secretKey: DIVA_LAKE_PASSWORD,
});

const sha256 = (buffer) => hasha.async(buffer, { algorithm: "sha256" });

const detectMimeType = async (buffer, filename) => {
  const fileType = await FileType.fromBuffer(buffer);
  if (fileType) {
    return fileType.mime;
  }
  if (path.extname(filename) === ".sas7bdat") {
    // special rule as sas7bdat is not known to known mimeType libs
    return "application/x-sas-data";
  }
  return lookup(filename) || "application/octet-stream";
};

const generateDivaLakeDistribution = () => ({
  type: "divaLake",
  divaLake: {
    url: DIVA_LAKE_HOST,
    port: DIVA_LAKE_PORT,
    username: DIVA_LAKE_USERNAME,
    password: DIVA_LAKE_PASSWORD,
  },
});

const generateFileResourceSchema = (file, uniqueFingerprint, mimeType) => ({
  title: file.originalname,
  filename: file.originalname,
  resourceType: "file",
  uniqueFingerprint,
  distributions: [generateDivaLakeDistribution()],
  mimeType,
});

const createResource = async (resourceSchema, actorid) =>
  axios
    .post(RESOURCE_MANAGEMENT_URL, resourceSchema, {
      headers: { "x-actorid": actorid },
    })
    .then(({ data }) => data)
    .catch((e) => {
      throw e?.response?.data || e;
    });

const uploadToDivaLake = async (hash, fileBuffer) => {
  await minioClient.putObject(BUCKET_NAME, hash, fileBuffer);
};

const removeFromDivaLake = async (hash) => {
  await minioClient.removeObject(BUCKET_NAME, hash);
};

class DivaLakeResourceService {
  async import(file, actorId) {
    const fileHashSha256 = await sha256(file.buffer);
    const mimeType = await detectMimeType(file.buffer, file.originalname);

    await uploadToDivaLake(fileHashSha256, file.buffer);
    return createResource(
      generateFileResourceSchema(file, fileHashSha256, mimeType),
      actorId
    ).catch((e) => {
      const code = e?.response?.data?.code;
      if (code !== 409) {
        removeFromDivaLake(fileHashSha256);
      }
      throw e;
    });
  }
}

module.exports = new DivaLakeResourceService();
