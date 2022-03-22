const Minio = require("minio");
const { logger: log } = require("@diva/common/logger");

const DIVA_LAKE_HOST = process.env.DIVA_LAKE_HOST || "localhost";
const DIVA_LAKE_PORT = parseInt(process.env.DIVA_LAKE_PORT, 10) || 9000;
const DIVA_LAKE_USERNAME = process.env.DIVA_LAKE_USERNAME || "minio_access";
const DIVA_LAKE_PASSWORD = process.env.DIVA_LAKE_PASSWORD || "minio_secret";
const BUCKET_NAME = process.env.DIVA_LAKE_BUCKET_NAME || "file-lake";

class MinIoConnector {
  async connect() {
    if (!this.client) {
      this.client = new Minio.Client({
        endPoint: DIVA_LAKE_HOST,
        port: DIVA_LAKE_PORT,
        useSSL: false,
        accessKey: DIVA_LAKE_USERNAME,
        secretKey: DIVA_LAKE_PASSWORD,
      });
      await this.checkConnection();
      log.info(`✅ MinIO is ready on '${DIVA_LAKE_HOST}.${DIVA_LAKE_PORT}'`);
    }
  }

  checkConnection() {
    return this.client.listBuckets();
  }

  downloadObject(hash) {
    return this.client.getObject(BUCKET_NAME, hash);
  }

  uploadObject(fileName, fileBuffer) {
    return this.client.putObject(BUCKET_NAME, fileName, fileBuffer);
  }

  removeObject(fileName) {
    return this.client.removeObject(BUCKET_NAME, fileName);
  }

  removeObjects(fileName) {
    return this.client.removeObjects(BUCKET_NAME, fileName);
  }
}

const minioConnector = new MinIoConnector();

module.exports = {
  minioConnector,
  DIVA_LAKE_HOST,
  DIVA_LAKE_USERNAME,
  DIVA_LAKE_PORT,
  DIVA_LAKE_PASSWORD,
};
