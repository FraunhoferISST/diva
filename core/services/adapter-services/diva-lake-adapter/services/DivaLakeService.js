const axios = require("axios");
const path = require("path");
const urljoin = require("url-join");
const hasha = require("hasha");
const { lookup } = require("mime-types");
const FileType = require("file-type");
const { fileNotFoundError } = require("../utils/errors");
const {
  DIVA_LAKE_USERNAME,
  DIVA_LAKE_PASSWORD,
  DIVA_LAKE_PORT,
  DIVA_LAKE_HOST,
  minioConnector,
} = require("../utils/MinIoConnector");

const ENTITY_MANAGEMENT_URL = urljoin(
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000",
  "resources"
);

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
  byteSize: file.size,
  resourceType: "file",
  uniqueFingerprint,
  distributions: [generateDivaLakeDistribution()],
  mimeType,
});

const createResource = async (resourceSchema, actorid) =>
  axios
    .post(ENTITY_MANAGEMENT_URL, resourceSchema, {
      headers: { "x-actorid": actorid },
    })
    .then(({ data }) => data)
    .catch((e) => {
      throw e?.response?.data || e;
    });

const deleteResource = async (resourceId, actorid) =>
  axios
    .delete(`${ENTITY_MANAGEMENT_URL}/${resourceId}`, {
      headers: { "x-actorid": actorid },
    })
    .catch((e) => {
      throw e?.response?.data || e;
    });

class DivaLakeResourceService {
  async init() {
    return minioConnector.connect();
  }

  async import(file, actorId) {
    const fileHashSha256 = await sha256(file.buffer);
    const mimeType = await detectMimeType(file.buffer, file.originalname);

    const resourceId = await createResource(
      generateFileResourceSchema(file, fileHashSha256, mimeType),
      actorId
    );
    await minioConnector.uploadObject(resourceId, file.buffer).catch((e) => {
      deleteResource(resourceId, actorId);
      throw e;
    });
    return resourceId;
  }

  async download(fileName) {
    return minioConnector.downloadObject(fileName).catch((e) => {
      if (e?.code === "NoSuchKey") {
        throw fileNotFoundError;
      }
      throw e;
    });
  }
}

module.exports = new DivaLakeResourceService();
